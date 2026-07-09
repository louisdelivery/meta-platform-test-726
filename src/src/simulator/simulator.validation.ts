import * as Joi from 'joi';

export const SimulateMessageSchema = Joi.object({
  type: Joi.string().valid('text', 'image', 'video', 'reaction', 'button', 'location', 'template').required(),
  from: Joi.string().trim().optional(),
  body: Joi.string().trim().optional(),
});

export const SimulateStatusSchema = Joi.object({
  waMessageId: Joi.string().trim().required(),
  status: Joi.string().valid('sent', 'delivered', 'read', 'failed').required(),
  recipientId: Joi.string().trim().optional(),
});
