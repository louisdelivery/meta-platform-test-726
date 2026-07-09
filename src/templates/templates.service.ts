import { Injectable } from '@nestjs/common';
import { TemplateStatusValue } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateTemplateDto } from '../meta/dto/create-template.dto';
import { MetaService } from '../meta/meta.service';

@Injectable()
export class TemplatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly meta: MetaService,
  ) {}

  async create(dto: CreateTemplateDto) {
    const graphResponse = await this.meta.createTemplate(dto);
    const template = await this.prisma.template.upsert({
      where: { name_language: { name: dto.name, language: dto.language } },
      create: {
        name: dto.name,
        language: dto.language,
        category: dto.category,
        components: dto.components ?? [],
        metaId: graphResponse?.id,
        status: TemplateStatusValue.PENDING,
        payload: graphResponse,
      },
      update: {
        category: dto.category,
        components: dto.components ?? [],
        metaId: graphResponse?.id,
        status: TemplateStatusValue.PENDING,
        payload: graphResponse,
      },
    });
    await this.prisma.templateStatus.create({
      data: {
        templateId: template.id,
        status: TemplateStatusValue.PENDING,
        payload: graphResponse,
      },
    });
    return {
      ok: true,
      template,
      note: 'Le statut final APPROVED ou REJECTED sera observe par webhook.',
    };
  }

  async findAll() {
    return this.prisma.template.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { statuses: { orderBy: { createdAt: 'desc' } } },
    });
  }
}
