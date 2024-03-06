import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
    // env
    PORT: Joi.number().required(),
    
    // DB
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
})