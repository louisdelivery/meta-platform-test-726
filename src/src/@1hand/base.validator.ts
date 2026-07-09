import * as Joi from 'joi';

export const PhoneNumberSchema = Joi.object({
  dialCode: Joi.string()
    .pattern(/^\+\d{1,4}$/)
    .required()
    .messages({
      'string.base': 'Le dialCode doit etre une chaine de caracteres.',
      'string.pattern.base': 'Le dialCode doit etre au format +NNN (ex: +237).',
      'any.required': 'Le dialCode est requis.',
    }),
  iso2: Joi.string().uppercase().length(2).required().messages({
    'string.base': 'Le code pays iso2 doit etre une chaine de caracteres.',
    'string.length': 'Le code pays iso2 doit contenir exactement 2 lettres.',
    'any.required': 'Le code pays iso2 est requis.',
  }),
  nationalNumber: Joi.string()
    .pattern(/^\d{4,14}$/)
    .required()
    .messages({
      'string.base': 'Le numero national doit etre une chaine de caracteres.',
      'string.pattern.base': 'Le numero national doit contenir entre 4 et 14 chiffres.',
      'any.required': 'Le numero national est requis.',
    }),
  internationalNumber: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.base': 'Le numero international doit etre une chaine de caracteres.',
      'string.pattern.base': 'Le numero international doit etre au format E.164 (ex: +237690123456).',
      'any.required': 'Le numero international est requis.',
    }),
})
  .required()
  .messages({
    'object.base': 'Le numero de telephone doit etre un objet.',
    'any.required': 'Le numero de telephone est requis.',
  });

export const FilterSchema = Joi.object({
  search: Joi.string().trim().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});
