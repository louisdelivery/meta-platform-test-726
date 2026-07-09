import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma/prisma.service';
import { SendTextMessageDto } from './dto/send-text-message.dto';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messages: MessagesService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('text')
  @ApiOperation({ summary: 'Envoie un message texte via Graph API puis cree une trace OUTBOUND locale' })
  sendText(@Body() dto: SendTextMessageDto) {
    return this.messages.sendText(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Liste tous les messages observes ou envoyes' })
  findAll() {
    return this.prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      include: { conversation: true, statuses: true, media: true },
    });
  }
}
