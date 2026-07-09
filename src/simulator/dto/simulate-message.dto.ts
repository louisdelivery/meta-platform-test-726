import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class SimulateMessageDto {
  @ApiProperty({ example: 'text', enum: ['text', 'image', 'video', 'reaction', 'button', 'location', 'template'] })
  @IsIn(['text', 'image', 'video', 'reaction', 'button', 'location', 'template'])
  type: string;

  @ApiPropertyOptional({ example: '33612345678' })
  @IsString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({ example: 'Bonjour, avez-vous des chaussures en 42 ?' })
  @IsString()
  @IsOptional()
  body?: string;
}
