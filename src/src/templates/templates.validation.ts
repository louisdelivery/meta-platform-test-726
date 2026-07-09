import * as Joi from "joi";
import { FilterSchema } from "../@1hand/base.validator";

export const CreateTemplateSchema = Joi.object({
  name: Joi.string().trim().required(),
  language: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
  components: Joi.array().items(Joi.object().unknown(true)).optional(),
});

export const FilterTemplateSchema = FilterSchema.keys({
  status: Joi.string().optional(),
});
