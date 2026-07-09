import { Injectable } from '@nestjs/common';
import { ConversationStatus } from '@prisma/client';
import { parsePagination } from 'src/@1hand/utils';
import { PrismaService } from 'src/prisma.service';
import { FilterConversationDto } from './conversations.types';
import { toConversationDto } from './conversations.mapper';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async touchConversation(phoneNumber: string, contactId?: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: { phoneNumber, status: ConversationStatus.OPEN },
      orderBy: { lastActivity: 'desc' },
    });
    if (existing) {
      return this.prisma.conversation.update({
        where: { id: existing.id },
        data: { lastActivity: new Date(), contactId: contactId ?? existing.contactId },
      });
    }
    return this.prisma.conversation.create({
      data: {
        phoneNumber,
        contactId,
        status: ConversationStatus.OPEN,
      },
    });
  }

  async selectMany(filter: FilterConversationDto) {
    const { page, limit, skip } = parsePagination(filter);
    const search = filter.search?.trim();
    const where = {
      status: filter.status as any,
      OR: search ? [{ phoneNumber: { contains: search } }] : undefined,
    };
    const [total, entities] = await this.prisma.$transaction([
      this.prisma.conversation.count({ where }),
      this.prisma.conversation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastActivity: 'desc' },
        include: {
          contact: true,
          _count: { select: { messages: true } },
        },
      }),
    ]);
    return { page, limit, total, data: entities.map(toConversationDto) };
  }

  selectById(id: string) {
    return this.prisma.conversation.findUniqueOrThrow({
      where: { id },
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { statuses: true, media: true },
        },
      },
    });
  }
}
