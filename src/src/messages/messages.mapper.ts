import { MessageDto } from './messages.types';

export function toMessageDto(entity: any): MessageDto {
  return {
    id: entity.id,
    waMessageId: entity.waMessageId ?? undefined,
    direction: entity.direction,
    type: entity.type,
    text: entity.text ?? undefined,
    conversationId: entity.conversationId ?? undefined,
    createdAt: entity.createdAt,
  };
}
