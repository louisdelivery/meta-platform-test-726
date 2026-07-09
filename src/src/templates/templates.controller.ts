import { Body, Controller, Get, Post, Query, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JoiValidationPipe } from "../@1hand/pipes/JoiValidatorPipe";
import { CreateTemplateDto, FilterTemplateDto } from "./templates.types";
import {
  CreateTemplateSchema,
  FilterTemplateSchema,
} from "./templates.validation";
import { TemplatesService } from "./templates.service";

@ApiTags("templates")
@Controller("templates")
export class TemplatesController {
  constructor(private readonly templates: TemplatesService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(CreateTemplateSchema))
  @ApiOperation({
    summary: "Cree un template puis conserve son etat local initial PENDING",
  })
  create(@Body() dto: CreateTemplateDto) {
    return this.templates.create(dto);
  }

  @Get()
  @UsePipes(new JoiValidationPipe(FilterTemplateSchema))
  @ApiOperation({
    summary:
      "Liste les templates locaux et tente aussi de lire Graph API si configure",
  })
  getAll(@Query() filter: FilterTemplateDto) {
    return this.templates.selectMany(filter);
  }
}
