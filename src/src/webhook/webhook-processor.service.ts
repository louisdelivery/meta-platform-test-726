import { Injectable, Logger } from '@nestjs/common';
import { MediaKind, MessageDirection, MessageStatusValue, TemplateStatusValue, WebhookEventType } from '@prisma/client';
import { ClassifiedWebhook } from '../common/types/webhook.types';
import { ContactsService } from '../contacts/contacts.service';
import { ConversationsService } from '../conversations/conversations.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class WebhookProcessorService {
  private readonly logger = new Logger(WebhookProcessorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly conversations: ConversationsService,
    private readonly contacts: ContactsService,
  ) {}

  async process(eventId: string, payload: any, classified: ClassifiedWebhook) {
    if (classified.firstMessage) {
      await this.processInboundMessage(payload, classified);
      return;
    }
    if (classified.firstStatus) {
      await this.processStatus(classified.firstStatus);
      return;
    }
    if (classified.type === WebhookEventType.TEMPLATE_STATUS) {
      await this.processTemplateStatus(payload);
      return;
    }
    this.logger.log(`Aucun traitement specialise pour ${classified.type} (${eventId})`);
  }

  private async processInboundMessage(payload: any, classified: ClassifiedWebhook) {
    const value = classified.firstChange?.value ?? {};
    const message = classified.firstMessage;
    const contactPayload = value.contacts?.[0];
    const from = message.from ?? contactPayload?.wa_id;
    const contact = from ? await this.contacts.upsertFromWebhook(from, contactPayload?.profile?.name) : undefined;

    const conversation = await this.conversations.touchConversation(from ?? 'unknown', contact?.id);
    const text = this.extractText(message);
    const savedMessage = await this.prisma.message.upsert({
      where: { waMessageId: message.id },
      update: { payload },
      create: {
        waMessageId: message.id,
        conversationId: conversation.id,
        contactId: contact?.id,
        direction: MessageDirection.INBOUND,
        type: classified.messageType,
        text,
        payload,
        receivedAt: message.timestamp ? new Date(Number(message.timestamp) * 1000) : new Date(),
      },
    });

    const media = this.extractMedia(message);
    if (media?.id) {
      await this.prisma.media.upsert({
        where: { mediaId: media.id },
        create: {
          mediaId: media.id,
          messageId: savedMessage.id,
          kind: media.kind as MediaKind,
          mimeType: media.mime_type,
          sha256: media.sha256,
          payload: media,
        },
        update: {
          messageId: savedMessage.id,
          mimeType: media.mime_type,
          sha256: media.sha256,
          payload: media,
        },
      });
    }
  }

  private async processStatus(status: any) {
    const normalized = this.mapStatus(status.status);
    const message = status.id
      ? await this.prisma.message.findUnique({ where: { waMessageId: status.id } })
      : undefined;
    await this.prisma.messageStatus.create({
      data: {
        messageId: message?.id,
        waMessageId: status.id,
        status: normalized,
        timestamp: status.timestamp ? new Date(Number(status.timestamp) * 1000) : new Date(),
        payload: status,
      },
    });
  }

  private async processTemplateStatus(payload: any) {
    const value = payload?.entry?.[0]?.changes?.[0]?.value ?? {};
    const name = value.message_template_name ?? value.name ?? 'unknown_template';
    const status = this.mapTemplateStatus(value.event ?? value.status);
    const template = await this.prisma.template.upsert({
      where: { name_language: { name, language: value.message_template_language ?? value.language ?? 'unknown' } },
      create: {
        name,
        language: value.message_template_language ?? value.language ?? 'unknown',
        metaId: value.message_template_id,
        status,
        payload: value,
      },
      update: {
        metaId: value.message_template_id,
        status,
        payload: value,
      },
    });
    await this.prisma.templateStatus.create({
      data: {
        templateId: template.id,
        status,
        reason: value.reason,
        payload: value,
      },
    });
  }

  private extractText(message: any): string | undefined {
    return (
      message.text?.body ??
      message.button?.text ??
      message.interactive?.button_reply?.title ??
      message.interactive?.list_reply?.title ??
      message.reaction?.emoji
    );
  }

  private extractMedia(message: any) {
    for (const kind of ['image', 'video', 'audio', 'document', 'sticker']) {
      if (message[kind]?.id) {
        return { ...message[kind], kind: kind.toUpperCase() };
      }
    }
    return undefined;
  }

  private mapStatus(status?: string): MessageStatusValue {
    switch (status) {
      case 'sent':
        return MessageStatusValue.SENT;
      case 'delivered':
        return MessageStatusValue.DELIVERED;
      case 'read':
        return MessageStatusValue.READ;
      case 'failed':
        return MessageStatusValue.FAILED;
      default:
        return MessageStatusValue.ACCEPTED;
    }
  }

  private mapTemplateStatus(status?: string): TemplateStatusValue {
    const normalized = String(status ?? '').toUpperCase();
    if (['PENDING', 'APPROVED', 'REJECTED', 'PAUSED', 'DISABLED'].includes(normalized)) {
      return normalized as TemplateStatusValue;
    }
    return TemplateStatusValue.UNKNOWN;
  }
}
