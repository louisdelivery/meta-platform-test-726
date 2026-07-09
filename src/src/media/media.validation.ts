import * as Joi from 'joi';
import { FilterSchema } from 'src/@1hand/base.validator';

export const FilterMediaSchema = FilterSchema.keys({
  kind: Joi.string().optional(),
});
