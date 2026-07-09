import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SendTextMessageDto {
  @ApiProperty({ example: '33612345678' })
  @IsString()
  to: string;

  @ApiProperty({ example: 'Bonjour, nous avons bien des chaussures en 42.' })
  @IsString()
  @MinLength(1)
  message: string;
}
