import { Module } from '@nestjs/common';
import { MetaModule } from '../meta/meta.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [MetaModule, ConversationsModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
