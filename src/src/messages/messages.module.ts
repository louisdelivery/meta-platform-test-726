import { Module } from '@nestjs/common';
import { MetaModule } from '../meta/meta.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { SharedModule } from '../shared/shared.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [SharedModule, MetaModule, ConversationsModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
