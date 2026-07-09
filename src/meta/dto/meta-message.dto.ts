import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class MetaMessageDto {
  @ApiProperty({ example: '33612345678' })
  @IsString()
  to: string;

  @ApiProperty({ example: 'text' })
  @IsString()
  type: string;

  @ApiProperty({
    example: {
      body: 'Bonjour depuis le laboratoire Meta.',
    },
  })
  @IsObject()
  @IsOptional()
  content?: Record<string, any>;
}
