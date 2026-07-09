import * as Joi from 'joi';
import { FilterSchema } from 'src/@1hand/base.validator';

export const FilterConversationSchema = FilterSchema.keys({
  status: Joi.string().valid('OPEN', 'CLOSED', 'ARCHIVED').optional(),
});
