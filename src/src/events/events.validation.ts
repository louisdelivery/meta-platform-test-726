import * as Joi from "joi";
import { FilterSchema } from "../@1hand/base.validator";

export const FilterEventSchema = FilterSchema.keys({
  type: Joi.string().optional(),
  processed: Joi.boolean().optional(),
});
