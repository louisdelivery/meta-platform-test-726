import { Injectable } from "@nestjs/common";
import { TemplateStatusValue } from "@prisma/client";
import { parsePagination } from "../@1hand/utils";
import { PrismaService } from "../prisma.service";
import { MetaService } from "../meta/meta.service";
import { CreateTemplateDto, FilterTemplateDto } from "./templates.types";
import { toTemplateDto } from "./templates.mapper";

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
        metaId: graphResponse?.data?.id,
        status: TemplateStatusValue.PENDING,
        payload: graphResponse.data,
      },
      update: {
        category: dto.category,
        components: dto.components ?? [],
        metaId: graphResponse?.data?.id,
        status: TemplateStatusValue.PENDING,
        payload: graphResponse.data,
      },
    });
    await this.prisma.templateStatus.create({
      data: {
        templateId: template.id,
        status: TemplateStatusValue.PENDING,
        payload: graphResponse.data,
      },
    });
    return {
      ok: true,
      template: toTemplateDto(template),
      note: "Le statut final APPROVED ou REJECTED sera observe par webhook.",
    };
  }

  async selectMany(filter: FilterTemplateDto) {
    const { page, limit, skip } = parsePagination(filter);
    const search = filter.search?.trim();
    const where = {
      status: filter.status as any,
      OR: search
        ? [{ name: { contains: search } }, { language: { contains: search } }]
        : undefined,
    };
    const [total, entities] = await this.prisma.$transaction([
      this.prisma.template.count({ where }),
      this.prisma.template.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: { statuses: { orderBy: { createdAt: "desc" } } },
      }),
    ]);
    return { page, limit, total, data: entities.map(toTemplateDto) };
  }
}
