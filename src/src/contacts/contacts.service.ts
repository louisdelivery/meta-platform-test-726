import { Injectable } from "@nestjs/common";
import { parsePagination } from "../@1hand/utils";
import { PrismaService } from "../prisma.service";
import { toContactDto } from "./contacts.mapper";
import { FilterContactDto } from "./contacts.types";

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  upsertFromWebhook(waId: string, displayName?: string) {
    return this.prisma.contact.upsert({
      where: { waId },
      create: { waId, displayName },
      update: { displayName },
    });
  }

  async selectMany(filter: FilterContactDto) {
    const { page, limit, skip } = parsePagination(filter);
    const search = filter.search?.trim();
    const where = search
      ? {
          OR: [
            { waId: { contains: search } },
            { displayName: { contains: search } },
          ],
        }
      : {};
    const [total, entities] = await this.prisma.$transaction([
      this.prisma.contact.count({ where }),
      this.prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          _count: { select: { messages: true, conversations: true } },
        },
      }),
    ]);
    return { page, limit, total, data: entities.map(toContactDto) };
  }
}
