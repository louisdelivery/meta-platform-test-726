import { Module } from '@nestjs/common';
import { WebhookModule } from '../webhook/webhook.module';
import { EventsController } from './events.controller';

@Module({
  imports: [WebhookModule],
  controllers: [EventsController],
})
export class EventsModule {}
