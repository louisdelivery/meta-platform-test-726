import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversations: ConversationsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste les conversations reconstruites depuis les webhooks' })
  findAll() {
    return this.conversations.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Affiche une conversation et tous ses messages' })
  findOne(@Param('id') id: string) {
    return this.conversations.findOne(id);
  }
}
