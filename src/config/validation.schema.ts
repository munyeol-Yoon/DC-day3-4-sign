import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  // env
  PORT: Joi.number().required(),

  // logger
  NODE_ENV: Joi.string().required(),
  APP_NAME: Joi.string().required(),
  LOG_DIR: Joi.string().required(),

  // jwt
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.string().required(),
  ACCESS_EXPIRES: Joi.string().required(),
  REFRESH_EXPIRES: Joi.string().required(),

  // DB
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
});
