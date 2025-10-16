const Joi = require("joi");

const idSchema = Joi.string().pattern(/^[\w-.]{2,50}$/);
const passwordSchema = Joi.string().min(2).max(50);

const signInSchema = Joi.object({
  userId: idSchema.required(),
  password: passwordSchema.required(),
});

const signUpSchema = Joi.object({
  userId: idSchema.required(),
  password: passwordSchema.required(),
  name: Joi.string().min(2).max(20).required(),
  perms: Joi.array().items(Joi.string()).required(),
});

module.exports = { signInSchema, signUpSchema };
