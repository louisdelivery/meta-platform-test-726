import * as Joi from "joi";
import { FilterSchema } from "../@1hand/base.validator";

export const SendTextMessageSchema = Joi.object({
  to: Joi.string().trim().required(),
  message: Joi.string().trim().min(1).required(),
});

export const FilterMessageSchema = FilterSchema.keys({
  direction: Joi.string().valid("INBOUND", "OUTBOUND").optional(),
  type: Joi.string().optional(),
});
