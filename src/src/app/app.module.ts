import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConversationsModule } from '../conversations/conversations.module';
import { ContactsModule } from '../contacts/contacts.module';
import { EventsModule } from '../events/events.module';
import { HealthModule } from '../health/health.module';
import { MediaModule } from '../media/media.module';
import { MessagesModule } from '../messages/messages.module';
import { MetaModule } from '../meta/meta.module';
import { SimulatorModule } from '../simulator/simulator.module';
import { TemplatesModule } from '../templates/templates.module';
import { WebhookModule } from '../webhook/webhook.module';
import configuration from '../config/configuration';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    EventEmitterModule.forRoot(),
    SharedModule,
    MetaModule,
    WebhookModule,
    EventsModule,
    ConversationsModule,
    MessagesModule,
    MediaModule,
    TemplatesModule,
    ContactsModule,
    SimulatorModule,
    HealthModule,
  ],
})
export class AppModule {}
