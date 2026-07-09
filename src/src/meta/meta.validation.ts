import * as Joi from 'joi';

export const MetaMessageSchema = Joi.object({
  to: Joi.string().trim().required(),
  type: Joi.string().trim().required(),
  content: Joi.object().unknown(true).optional(),
});

export const CreateTemplateSchema = Joi.object({
  name: Joi.string().trim().required(),
  language: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
  components: Joi.array().items(Joi.object().unknown(true)).optional(),
});
