import { MessageType, WebhookEventType } from '@prisma/client';
import { ClassifiedWebhook } from '../common/types/webhook.types';

const mediaTypes = new Set(['image', 'video', 'audio', 'document', 'sticker']);

export function classifyWebhook(payload: any): ClassifiedWebhook {
  const firstChange = payload?.entry?.[0]?.changes?.[0];
  const value = firstChange?.value;
  const firstMessage = value?.messages?.[0];
  const firstStatus = value?.statuses?.[0];

  if (firstMessage) {
    const messageType = mapMessageType(firstMessage.type);
    if (firstMessage.type === 'text') return { type: WebhookEventType.MESSAGE_TEXT, messageType, firstMessage, firstChange };
    if (mediaTypes.has(firstMessage.type)) return { type: WebhookEventType.MESSAGE_MEDIA, messageType, firstMessage, firstChange };
    if (firstMessage.type === 'reaction') return { type: WebhookEventType.MESSAGE_REACTION, messageType, firstMessage, firstChange };
    if (firstMessage.type === 'button' || firstMessage.type === 'interactive') {
      return { type: WebhookEventType.MESSAGE_BUTTON, messageType, firstMessage, firstChange };
    }
    if (firstMessage.type === 'location') return { type: WebhookEventType.MESSAGE_LOCATION, messageType, firstMessage, firstChange };
    return { type: WebhookEventType.MESSAGE_UNKNOWN, messageType, firstMessage, firstChange };
  }

  if (firstStatus) {
    const status = String(firstStatus.status ?? '').toLowerCase();
    if (status === 'sent') return { type: WebhookEventType.STATUS_SENT, firstStatus, firstChange };
    if (status === 'delivered') return { type: WebhookEventType.STATUS_DELIVERED, firstStatus, firstChange };
    if (status === 'read') return { type: WebhookEventType.STATUS_READ, firstStatus, firstChange };
    if (status === 'failed') return { type: WebhookEventType.STATUS_FAILED, firstStatus, firstChange };
  }

  if (value?.message_template_id || value?.event === 'message_template_status_update') {
    return { type: WebhookEventType.TEMPLATE_STATUS, firstChange };
  }

  if (firstChange?.field) {
    return { type: WebhookEventType.ACCOUNT_UPDATE, firstChange };
  }

  return { type: WebhookEventType.UNKNOWN, firstChange };
}

export function mapMessageType(type?: string): MessageType {
  switch (type) {
    case 'text':
      return MessageType.TEXT;
    case 'image':
      return MessageType.IMAGE;
    case 'video':
      return MessageType.VIDEO;
    case 'audio':
      return MessageType.AUDIO;
    case 'document':
      return MessageType.DOCUMENT;
    case 'sticker':
      return MessageType.STICKER;
    case 'location':
      return MessageType.LOCATION;
    case 'button':
      return MessageType.BUTTON;
    case 'interactive':
      return MessageType.INTERACTIVE;
    case 'template':
      return MessageType.TEMPLATE;
    case 'reaction':
      return MessageType.REACTION;
    default:
      return MessageType.UNKNOWN;
  }
}
