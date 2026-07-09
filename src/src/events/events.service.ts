import { Injectable } from "@nestjs/common";
import { parsePagination } from "../@1hand/utils";
import { PrismaService } from "../prisma.service";
import { FilterEventDto } from "./events.types";
import { toWebhookEventDto } from "./events.mapper";

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.webhookEvent.create({ data });
  }

  async selectMany(filter: FilterEventDto) {
    const { page, limit, skip } = parsePagination(filter);
    const search = filter.search?.trim();
    const where = {
      type: filter.type as any,
      processed:
        typeof filter.processed === "boolean" ? filter.processed : undefined,
      OR: search
        ? [{ id: { contains: search } }, { signature: { contains: search } }]
        : undefined,
    };
    const [total, entities] = await this.prisma.$transaction([
      this.prisma.webhookEvent.count({ where }),
      this.prisma.webhookEvent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { receivedAt: "desc" },
      }),
    ]);
    return { page, limit, total, data: entities.map(toWebhookEventDto) };
  }

  selectById(id: string) {
    return this.prisma.webhookEvent.findUniqueOrThrow({ where: { id } });
  }

  updateProcessing(
    id: string,
    data: { processed: boolean; processingTime?: number; error?: string },
  ) {
    return this.prisma.webhookEvent.update({ where: { id }, data });
  }
}
