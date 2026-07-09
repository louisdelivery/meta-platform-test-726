import { MediaDto } from './media.types';

export function toMediaDto(entity: any): MediaDto {
  return {
    id: entity.id,
    mediaId: entity.mediaId,
    kind: entity.kind,
    mimeType: entity.mimeType ?? undefined,
    filePath: entity.filePath ?? undefined,
  };
}
