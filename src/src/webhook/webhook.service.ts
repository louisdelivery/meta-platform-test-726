import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { createHmac, timingSafeEqual } from "crypto";
import { ApiLogDirection } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { classifyWebhook } from "./webhook-classifier";
import { WebhookProcessorService } from "./webhook-processor.service";

interface IngestOptions {
  payload: any;
  headers?: Record<string, any>;
  rawBody?: Buffer;
  signature?: string;
  verifySignature: boolean;
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
    private readonly processor: WebhookProcessorService,
  ) {}

  async ingest(options: IngestOptions) {
    const started = Date.now();
    this.logger.log("Webhook recu");

    if (options.verifySignature) {
      this.verifySignature(options.rawBody, options.signature);
      this.logger.log("Signature valide");
    }

    const classified = classifyWebhook(options.payload);
    const event = await this.prisma.webhookEvent.create({
      data: {
        signature: options.signature,
        headers: options.headers ?? {},
        payload: options.payload,
        type: classified.type,
      },
    });
    this.logger.log(`Payload enregistre, type = ${classified.type}`);

    await this.prisma.apiLog.create({
      data: {
        direction: ApiLogDirection.INBOUND,
        method: "POST",
        url: "/webhook",
        statusCode: 200,
        requestBody: options.payload,
        responseBody: { eventId: event.id, type: classified.type },
        durationMs: Date.now() - started,
      },
    });

    void this.processStoredEvent(
      event.id,
      options.payload,
      classified,
      started,
    );
    this.events.emit("webhook.received", {
      eventId: event.id,
      type: classified.type,
    });
    this.logger.log("Reponse 200 envoyee a Meta");
    return event;
  }

  async replay(eventId: string) {
    const event = await this.prisma.webhookEvent.findUniqueOrThrow({
      where: { id: eventId },
    });
    const classified = classifyWebhook(event.payload);
    await this.processor.process(event.id, event.payload, classified);
    this.events.emit("webhook.replayed", {
      eventId: event.id,
      type: classified.type,
    });
    return { ok: true, eventId: event.id, type: classified.type };
  }

  private async processStoredEvent(
    eventId: string,
    payload: any,
    classified: ReturnType<typeof classifyWebhook>,
    started: number,
  ) {
    try {
      await this.processor.process(eventId, payload, classified);
      const processingTime = Date.now() - started;
      await this.prisma.webhookEvent.update({
        where: { id: eventId },
        data: { processed: true, processingTime },
      });
      this.logger.log("Conversation/message/statut enregistres");
    } catch (error: any) {
      await this.prisma.webhookEvent.update({
        where: { id: eventId },
        data: {
          processed: false,
          processingTime: Date.now() - started,
          error: error.message,
        },
      });
      this.logger.error(`Erreur traitement webhook: ${error.message}`);
    }
  }

  private verifySignature(rawBody?: Buffer, signature?: string) {
    const appSecret = this.config.get<string>("meta.appSecret");
    if (!appSecret) {
      this.logger.warn(
        "META_APP_SECRET absent: verification HMAC ignoree en mode laboratoire",
      );
      return;
    }
    if (!rawBody) {
      throw new BadRequestException(
        "rawBody manquant: impossible de verifier la signature",
      );
    }
    if (!signature?.startsWith("sha256=")) {
      throw new UnauthorizedException(
        "Signature x-hub-signature-256 manquante",
      );
    }
    const expected = `sha256=${createHmac("sha256", appSecret).update(rawBody).digest("hex")}`;
    const expectedBuffer = Buffer.from(expected);
    const actualBuffer = Buffer.from(signature);
    if (
      expectedBuffer.length !== actualBuffer.length ||
      !timingSafeEqual(expectedBuffer, actualBuffer)
    ) {
      throw new UnauthorizedException("Signature Meta invalide");
    }
  }
}
