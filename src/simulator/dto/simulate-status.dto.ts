import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class SimulateStatusDto {
  @ApiProperty({ example: 'wamid.local_123' })
  @IsString()
  waMessageId: string;

  @ApiProperty({ example: 'delivered', enum: ['sent', 'delivered', 'read', 'failed'] })
  @IsIn(['sent', 'delivered', 'read', 'failed'])
  status: string;

  @ApiPropertyOptional({ example: '33612345678' })
  @IsString()
  @IsOptional()
  recipientId?: string;
}
