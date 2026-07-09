import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SimulateMessageDto {
  @ApiProperty({ example: 'text', enum: ['text', 'image', 'video', 'reaction', 'button', 'location', 'template'] })
  type: string;

  @ApiPropertyOptional({ example: '33612345678' })
  from?: string;

  @ApiPropertyOptional({ example: 'Bonjour, avez-vous des chaussures en 42 ?' })
  body?: string;
}

export class SimulateStatusDto {
  @ApiProperty({ example: 'wamid.local_123' })
  waMessageId: string;

  @ApiProperty({ example: 'delivered', enum: ['sent', 'delivered', 'read', 'failed'] })
  status: string;

  @ApiPropertyOptional({ example: '33612345678' })
  recipientId?: string;
}
