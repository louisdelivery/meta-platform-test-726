import { TemplateDto } from './templates.types';

export function toTemplateDto(entity: any): TemplateDto {
  return {
    id: entity.id,
    name: entity.name,
    language: entity.language,
    status: entity.status,
    category: entity.category ?? undefined,
  };
}
