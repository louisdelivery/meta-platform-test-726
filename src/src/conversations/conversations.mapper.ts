import { ConversationDto } from './conversations.types';

export function toConversationDto(entity: any): ConversationDto {
  return {
    id: entity.id,
    phoneNumber: entity.phoneNumber,
    status: entity.status,
    startedAt: entity.startedAt,
    lastActivity: entity.lastActivity,
    contactId: entity.contactId ?? undefined,
  };
}
