"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv_1.default.config();
if (envFound.error) {
    // This error will crash the whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
exports.default = {
    // Server run port
    port: process.env.PORT || 3000,
    // Mongodb database url
    databaseURL: process.env.MONGODB_URI || "",
    // jwt secret key and hash algorithms
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGO,
    //winston logger
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    // api config
    api: {
        prefix: '/api',
    },
    // CREATE USER hwy WITH PASSWORD 'pgtest';
    // CREATE DATABASE seatmanager;
    //Postgrpsql Local DB config
    // HOST: "localhost",
    // USER: "hwy",
    // PASSWORD: "pgtest",
    // DB: "seatmanager",
    // dialect: "postgresql",
    // pool: {
    //   max: 5,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000
    // }
    HOST: "ts-db-hwy.database.windows.net",
    USER: "htoowaiyan",
    PASSWORD: "p@s2w0Rd",
    DB: "heingp",
    dialect: "mssql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
    // 
    // // Driver={ODBC Driver 13 for SQL Server};
    // Server=tcp:tastytest.database.windows.net,1433;
    // Database=heingp;
    // Uid=htoowaiyan;
    // Pwd={your_password_here};
    // Encrypt=yes;
    // TrustServerCertificate=no;
    // Connection Timeout=30;
};
