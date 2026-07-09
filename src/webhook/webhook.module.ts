import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { WebhookController } from './webhook.controller';
import { WebhookProcessorService } from './webhook-processor.service';
import { WebhookService } from './webhook.service';

@Module({
  imports: [ConversationsModule],
  controllers: [WebhookController],
  providers: [WebhookService, WebhookProcessorService],
  exports: [WebhookService, WebhookProcessorService],
})
export class WebhookModule {}
