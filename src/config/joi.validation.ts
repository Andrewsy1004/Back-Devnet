
import * as Joi from 'joi';

export const joiValidationSchema = Joi.object({
    PORTAPP:     Joi.number().required(),
    DB_PORT:     Joi.number().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME:     Joi.string().required(),
    DB_HOST:     Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    JWT_SECRET:  Joi.string().required(),
    EMAIL_PASS:  Joi.string().required(),
    EMAIL_HOST:  Joi.string().required(),
});
