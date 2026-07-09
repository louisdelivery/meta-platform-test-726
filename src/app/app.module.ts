import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConversationsModule } from '../conversations/conversations.module';
import { ContactsModule } from '../contacts/contacts.module';
import { DatabaseModule } from '../database/prisma/database.module';
import { EventsModule } from '../events/events.module';
import { HealthModule } from '../health/health.module';
import { MediaModule } from '../media/media.module';
import { MessagesModule } from '../messages/messages.module';
import { MetaModule } from '../meta/meta.module';
import { SimulatorModule } from '../simulator/simulator.module';
import { TemplatesModule } from '../templates/templates.module';
import { WebhookModule } from '../webhook/webhook.module';
import configuration from '../common/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
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
