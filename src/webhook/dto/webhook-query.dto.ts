import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class WebhookQueryDto {
  @ApiPropertyOptional({ name: 'hub.mode', example: 'subscribe' })
  @IsString()
  @IsOptional()
  'hub.mode'?: string;

  @ApiPropertyOptional({ name: 'hub.verify_token', example: 'local_verify_token' })
  @IsString()
  @IsOptional()
  'hub.verify_token'?: string;

  @ApiPropertyOptional({ name: 'hub.challenge', example: '123456789' })
  @IsString()
  @IsOptional()
  'hub.challenge'?: string;
}
