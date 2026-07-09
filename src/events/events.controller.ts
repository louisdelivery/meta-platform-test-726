import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma/prisma.service';
import { WebhookService } from '../webhook/webhook.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webhook: WebhookService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Liste tous les webhooks bruts recus ou simules' })
  findAll() {
    return this.prisma.webhookEvent.findMany({ orderBy: { receivedAt: 'desc' } });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Affiche le payload exact envoye par Meta' })
  findOne(@Param('id') id: string) {
    return this.prisma.webhookEvent.findUniqueOrThrow({ where: { id } });
  }

  @Post(':id/replay')
  @ApiOperation({ summary: 'Rejoue le payload stocke comme si Meta venait de le renvoyer' })
  replay(@Param('id') id: string) {
    return this.webhook.replay(id);
  }
}
