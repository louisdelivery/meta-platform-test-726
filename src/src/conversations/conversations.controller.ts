import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JoiValidationPipe } from 'src/@1hand/pipes/JoiValidatorPipe';
import { FilterConversationDto } from './conversations.types';
import { FilterConversationSchema } from './conversations.validation';
import { ConversationsService } from './conversations.service';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversations: ConversationsService) {}

  @Get()
  @UsePipes(new JoiValidationPipe(FilterConversationSchema))
  @ApiOperation({ summary: 'Liste les conversations reconstruites depuis les webhooks' })
  getAll(@Query() filter: FilterConversationDto) {
    return this.conversations.selectMany(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Affiche une conversation et tous ses messages' })
  getById(@Param('id') id: string) {
    return this.conversations.selectById(id);
  }
}
