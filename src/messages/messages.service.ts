import { Injectable, Logger } from '@nestjs/common';
import { MessageDirection, MessageStatusValue, MessageType } from '@prisma/client';
import { ConversationsService } from '../conversations/conversations.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { MetaService } from '../meta/meta.service';
import { SendTextMessageDto } from './dto/send-text-message.dto';

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
    const waMessageId = graphResponse?.messages?.[0]?.id;
    const conversation = await this.conversations.touchConversation(dto.to);
    const message = await this.prisma.message.create({
      data: {
        waMessageId,
        conversationId: conversation.id,
        direction: MessageDirection.OUTBOUND,
        type: MessageType.TEXT,
        text: dto.message,
        payload: graphResponse,
        sentAt: new Date(),
      },
    });
    await this.prisma.messageStatus.create({
      data: {
        messageId: message.id,
        waMessageId,
        status: MessageStatusValue.ACCEPTED,
        payload: graphResponse,
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
}
