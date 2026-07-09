import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterDto } from 'src/@1hand/base.type';

export class MediaDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  mediaId: string;

  @ApiProperty()
  kind: string;

  @ApiPropertyOptional()
  mimeType?: string;

  @ApiPropertyOptional()
  filePath?: string;
}

export class FilterMediaDto extends BaseFilterDto {
  @ApiPropertyOptional({ example: 'IMAGE' })
  kind?: string;
}
