import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { ContactsModule } from '../contacts/contacts.module';
import { SharedModule } from '../shared/shared.module';
import { WebhookController } from './webhook.controller';
import { WebhookProcessorService } from './webhook-processor.service';
import { WebhookService } from './webhook.service';

@Module({
  imports: [SharedModule, ConversationsModule, ContactsModule],
  controllers: [WebhookController],
  providers: [WebhookService, WebhookProcessorService],
  exports: [WebhookService, WebhookProcessorService],
})
export class WebhookModule {}
