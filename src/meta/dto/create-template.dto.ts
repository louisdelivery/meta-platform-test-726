import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({ example: 'order_update' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'fr' })
  @IsString()
  language: string;

  @ApiProperty({ example: 'UTILITY' })
  @IsString()
  category: string;

  @ApiPropertyOptional({
    example: [
      {
        type: 'BODY',
        text: 'Bonjour {{1}}, votre commande est prete.',
      },
    ],
  })
  @IsArray()
  @IsOptional()
  components?: any[];
}
