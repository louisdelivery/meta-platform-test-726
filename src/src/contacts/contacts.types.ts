import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterDto } from 'src/@1hand/base.type';

export class ContactDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  waId: string;

  @ApiPropertyOptional()
  displayName?: string;

  @ApiProperty()
  createdAt: Date;
}

export class FilterContactDto extends BaseFilterDto {}
