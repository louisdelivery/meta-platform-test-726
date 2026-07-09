import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BaseFilterDto } from "../@1hand/base.type";

export class TemplateDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  language: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  category?: string;
}

export class CreateTemplateDto {
  @ApiProperty({ example: "order_update" })
  name: string;

  @ApiProperty({ example: "fr" })
  language: string;

  @ApiProperty({ example: "UTILITY" })
  category: string;

  @ApiPropertyOptional({
    example: [
      { type: "BODY", text: "Bonjour {{1}}, votre commande est prete." },
    ],
  })
  components?: any[];
}

export class FilterTemplateDto extends BaseFilterDto {
  @ApiPropertyOptional({ example: "APPROVED" })
  status?: string;
}
