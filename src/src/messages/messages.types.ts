import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterDto } from 'src/@1hand/base.type';

export class MessageDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  waMessageId?: string;

  @ApiProperty()
  direction: string;

  @ApiProperty()
  type: string;

  @ApiPropertyOptional()
  text?: string;

  @ApiPropertyOptional()
  conversationId?: string;

  @ApiProperty()
  createdAt: Date;
}

export class SendTextMessageDto {
  @ApiProperty({ example: '33612345678' })
  to: string;

  @ApiProperty({ example: 'Bonjour, nous avons bien des chaussures en 42.' })
  message: string;
}

export class FilterMessageDto extends BaseFilterDto {
  @ApiPropertyOptional({ example: 'INBOUND' })
  direction?: string;

  @ApiPropertyOptional({ example: 'TEXT' })
  type?: string;
}
