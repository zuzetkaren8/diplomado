import joi from 'joi';

export const createUserSchema = joi.object({
  username: joi.string().min(3).max(30).required().alphanum(),
  password: joi.string().required(),
});