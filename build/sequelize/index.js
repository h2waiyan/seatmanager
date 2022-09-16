"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const sequelize_1 = require("sequelize");
const tedious_1 = __importDefault(require("tedious"));
//create connection
const sequelize = new sequelize_1.Sequelize(config_1.default.DB, config_1.default.USER, config_1.default.PASSWORD, {
    host: config_1.default.HOST,
    dialect: "mssql",
    dialectModule: tedious_1.default,
    pool: {
        max: config_1.default.pool.max,
        min: config_1.default.pool.min,
        acquire: config_1.default.pool.acquire,
        idle: config_1.default.pool.idle,
    },
    dialectOptions: {
        encrypt: true
    }
});
exports.default = sequelize;
