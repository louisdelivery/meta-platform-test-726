import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { WebhookModule } from '../webhook/webhook.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [SharedModule, WebhookModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
