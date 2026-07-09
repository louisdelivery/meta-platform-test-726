import { WebhookEventDto } from './events.types';

export function toWebhookEventDto(entity: any): WebhookEventDto {
  return {
    id: entity.id,
    type: entity.type,
    processed: entity.processed,
    receivedAt: entity.receivedAt,
    processingTime: entity.processingTime ?? undefined,
  };
}
