import { Sequelize } from 'sequelize';
import config from '../config/env.js';

export const sequelize = new Sequelize(
    config.DB_DATABASE, //db name
    config.DB_USER, //db user
    config.DB_PASSWORD, //db password
    {
        host: config.DB_HOST,
        dialect: config.DB_DIALECT,
        logging: console.log,
    }
);
