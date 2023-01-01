"use strict";
// import config from '../config';
// import { Sequelize } from 'sequelize';
// import tedious from 'tedious';
//create connection
// const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
//   host: config.HOST,
//   dialect: "mssql", //mssql
//   dialectModule: tedious,
//   pool: {
//     max: config.pool.max,
//     min: config.pool.min,
//     acquire: config.pool.acquire,
//     idle: config.pool.idle,
//   },
//   dialectOptions: {
//     encrypt: true
//   }
// });
// });
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// export default sequelize;
const config_1 = __importDefault(require("../config"));
const sequelize_1 = require("sequelize");
//create connection
const sequelize = new sequelize_1.Sequelize(config_1.default.DB, config_1.default.USER, config_1.default.PASSWORD, {
    host: config_1.default.HOST,
    dialect: "postgres",
    pool: {
        max: config_1.default.pool.max,
        min: config_1.default.pool.min,
        acquire: config_1.default.pool.acquire,
        idle: config_1.default.pool.idle,
    },
});
exports.default = sequelize;
