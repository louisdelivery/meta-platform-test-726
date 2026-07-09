import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MetaMessageDto {
  @ApiProperty({ example: '33612345678' })
  to: string;

  @ApiProperty({ example: 'text' })
  type: string;

  @ApiPropertyOptional({ example: { body: 'Bonjour depuis le laboratoire Meta.' } })
  content?: Record<string, any>;
}

export class CreateTemplateDto {
  @ApiProperty({ example: 'order_update' })
  name: string;

  @ApiProperty({ example: 'fr' })
  language: string;

  @ApiProperty({ example: 'UTILITY' })
  category: string;

  @ApiPropertyOptional({
    example: [{ type: 'BODY', text: 'Bonjour {{1}}, votre commande est prete.' }],
  })
  components?: any[];
}

export class MetaGraphResponseDto {
  @ApiProperty()
  data: any;
}
