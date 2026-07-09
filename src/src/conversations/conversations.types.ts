import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterDto } from 'src/@1hand/base.type';

export class ConversationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  startedAt: Date;

  @ApiProperty()
  lastActivity: Date;

  @ApiPropertyOptional()
  contactId?: string;
}

export class FilterConversationDto extends BaseFilterDto {
  @ApiPropertyOptional({ example: 'OPEN' })
  status?: string;
}
