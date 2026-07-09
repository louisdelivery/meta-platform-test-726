import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TemplateCreateDto } from './dto/template-create.dto';
import { TemplatesService } from './templates.service';

@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templates: TemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Cree un template puis conserve son etat local initial PENDING' })
  create(@Body() dto: TemplateCreateDto) {
    return this.templates.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Liste les templates locaux et tente aussi de lire Graph API si configure' })
  findAll() {
    return this.templates.findAll();
  }
}
