import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterDto } from 'src/@1hand/base.type';

export class WebhookEventDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  processed: boolean;

  @ApiProperty()
  receivedAt: Date;

  @ApiPropertyOptional()
  processingTime?: number;
}

export class FilterEventDto extends BaseFilterDto {
  @ApiPropertyOptional({ example: 'MESSAGE_TEXT' })
  type?: string;

  @ApiPropertyOptional({ example: true })
  processed?: boolean;
}
