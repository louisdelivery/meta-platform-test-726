import { ApiPropertyOptional } from '@nestjs/swagger';

export class WebhookChallengeDto {
  @ApiPropertyOptional({ name: 'hub.mode', example: 'subscribe' })
  'hub.mode'?: string;

  @ApiPropertyOptional({ name: 'hub.verify_token', example: 'local_verify_token' })
  'hub.verify_token'?: string;

  @ApiPropertyOptional({ name: 'hub.challenge', example: '123456789' })
  'hub.challenge'?: string;
}

export class WebhookIngestDto {
  @ApiPropertyOptional()
  object?: string;

  @ApiPropertyOptional()
  entry?: any[];
}
