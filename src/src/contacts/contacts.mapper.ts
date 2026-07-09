import { ContactDto } from './contacts.types';

export function toContactDto(entity: any): ContactDto {
  return {
    id: entity.id,
    waId: entity.waId,
    displayName: entity.displayName ?? undefined,
    createdAt: entity.createdAt,
  };
}
