import * as Joi from 'joi';

export const WebhookChallengeSchema = Joi.object({
  'hub.mode': Joi.string().optional(),
  'hub.verify_token': Joi.string().optional(),
  'hub.challenge': Joi.string().optional(),
});

export const WebhookIngestSchema = Joi.object({
  object: Joi.string().optional(),
  entry: Joi.array().items(Joi.object().unknown(true)).optional(),
}).unknown(true);
