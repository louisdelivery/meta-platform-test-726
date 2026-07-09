import { Injectable, Logger } from '@nestjs/common';
import { MessageDirection, MessageStatusValue, MessageType } from '@prisma/client';
import { ConversationsService } from '../conversations/conversations.service';
import { PrismaService } from 'src/prisma.service';
import { MetaService } from '../meta/meta.service';
import { parsePagination } from 'src/@1hand/utils';
import { FilterMessageDto, SendTextMessageDto } from './messages.types';
import { toMessageDto } from './messages.mapper';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private readonly meta: MetaService,
    private readonly prisma: PrismaService,
    private readonly conversations: ConversationsService,
  ) {}

  async sendText(dto: SendTextMessageDto) {
    this.logger.log(`Envoi Graph API vers ${dto.to}`);
    const graphResponse = await this.meta.sendText(dto.to, dto.message);
    const waMessageId = graphResponse?.data?.messages?.[0]?.id;
    const conversation = await this.conversations.touchConversation(dto.to);
    const message = await this.prisma.message.create({
      data: {
        waMessageId,
        conversationId: conversation.id,
        direction: MessageDirection.OUTBOUND,
        type: MessageType.TEXT,
        text: dto.message,
        payload: graphResponse.data,
        sentAt: new Date(),
      },
    });
    await this.prisma.messageStatus.create({
      data: {
        messageId: message.id,
        waMessageId,
        status: MessageStatusValue.ACCEPTED,
        payload: graphResponse.data,
        timestamp: new Date(),
      },
    });
    return {
      ok: true,
      localMessageId: message.id,
      waMessageId,
      note: 'Graph API a accepte la requete. Les confirmations sent/delivered/read arriveront ensuite par webhook.',
      graphResponse,
    };
  }

  async selectMany(filter: FilterMessageDto) {
    const { page, limit, skip } = parsePagination(filter);
    const search = filter.search?.trim();
    const where = {
      direction: filter.direction as any,
      type: filter.type as any,
      OR: search ? [{ text: { contains: search } }, { waMessageId: { contains: search } }] : undefined,
    };
    const [total, entities] = await this.prisma.$transaction([
      this.prisma.message.count({ where }),
      this.prisma.message.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { conversation: true, statuses: true, media: true },
      }),
    ]);
    return { page, limit, total, data: entities.map(toMessageDto) };
  }
}
