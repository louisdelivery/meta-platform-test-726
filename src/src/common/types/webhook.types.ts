import { MessageType, WebhookEventType } from '@prisma/client';

export interface ClassifiedWebhook {
  type: WebhookEventType;
  messageType?: MessageType;
  firstMessage?: any;
  firstStatus?: any;
  firstChange?: any;
}
