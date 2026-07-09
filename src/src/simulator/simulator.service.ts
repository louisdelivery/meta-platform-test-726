import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { WebhookService } from '../webhook/webhook.service';
import { SimulateMessageDto, SimulateStatusDto } from './simulator.types';
import { toSimulatorResultDto } from './simulator.mapper';

@Injectable()
export class SimulatorService {
  constructor(
    private readonly config: ConfigService,
    private readonly webhook: WebhookService,
  ) {}

  async message(dto: SimulateMessageDto) {
    const from = dto.from ?? this.config.get<string>('lab.simulatorPhoneNumber');
    const message = this.messagePayload(dto.type, dto.body);
    const payload = this.wrap({
      messaging_product: 'whatsapp',
      metadata: {
        display_phone_number: '15550000000',
        phone_number_id: this.config.get<string>('meta.phoneNumberId') ?? 'local_phone_number_id',
      },
      contacts: [{ profile: { name: 'Client Simule' }, wa_id: from }],
      messages: [
        {
          from,
          id: `wamid.sim_${randomUUID()}`,
          timestamp: Math.floor(Date.now() / 1000).toString(),
          type: dto.type,
          ...message,
        },
      ],
    });
    const event = await this.webhook.ingest({
      payload,
      headers: { 'x-meta-lab-simulator': 'true' },
      verifySignature: false,
    });
    return toSimulatorResultDto(event);
  }

  async status(dto: SimulateStatusDto) {
    const payload = this.wrap({
      messaging_product: 'whatsapp',
      metadata: {
        display_phone_number: '15550000000',
        phone_number_id: this.config.get<string>('meta.phoneNumberId') ?? 'local_phone_number_id',
      },
      statuses: [
        {
          id: dto.waMessageId,
          status: dto.status,
          timestamp: Math.floor(Date.now() / 1000).toString(),
          recipient_id: dto.recipientId ?? this.config.get<string>('lab.simulatorPhoneNumber'),
        },
      ],
    });
    const event = await this.webhook.ingest({
      payload,
      headers: { 'x-meta-lab-simulator': 'true' },
      verifySignature: false,
    });
    return toSimulatorResultDto(event);
  }

  private wrap(value: any) {
    return {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: this.config.get<string>('meta.wabaId') ?? 'local_waba_id',
          changes: [{ field: 'messages', value }],
        },
      ],
    };
  }

  private messagePayload(type: string, body?: string) {
    switch (type) {
      case 'image':
        return { image: { id: `media_${randomUUID()}`, mime_type: 'image/jpeg', sha256: 'simulated_sha256' } };
      case 'video':
        return { video: { id: `media_${randomUUID()}`, mime_type: 'video/mp4', sha256: 'simulated_sha256' } };
      case 'reaction':
        return { reaction: { message_id: `wamid.sim_${randomUUID()}`, emoji: body ?? '👍' } };
      case 'button':
        return { button: { payload: 'YES', text: body ?? 'Oui' } };
      case 'location':
        return { location: { latitude: 48.8566, longitude: 2.3522, name: body ?? 'Paris' } };
      case 'template':
        return { template: { name: body ?? 'hello_world', language: { code: 'fr' } } };
      default:
        return { text: { body: body ?? 'Bonjour, avez-vous des chaussures en 42 ?' } };
    }
  }
}
