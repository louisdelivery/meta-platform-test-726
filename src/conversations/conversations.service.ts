import { Injectable } from '@nestjs/common';
import { ConversationStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';

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

  findAll() {
    return this.prisma.conversation.findMany({
      orderBy: { lastActivity: 'desc' },
      include: {
        contact: true,
        _count: { select: { messages: true } },
      },
    });
  }

  findOne(id: string) {
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
