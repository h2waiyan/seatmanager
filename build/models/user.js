"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
// Model for user table
const userModel = (sequelize, Sequelize) => {
    const users = sequelize.define('users', {
        userid: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        usertype: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        gate_id: {
            type: Sequelize.STRING,
        },
        service_fee_id: {
            type: Sequelize.STRING,
        },
        user_remark: {
            type: Sequelize.STRING,
        },
        isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        sessionexpired: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        t1: {
            type: Sequelize.STRING,
        },
        t2: {
            type: Sequelize.STRING,
        },
        t3: {
            type: Sequelize.STRING,
        }
    });
    return users;
};
const userTable = {};
userTable.Sequelize = sequelize_1.Sequelize;
userTable.sequelize = sequelize_2.default;
//create model
userTable.services = userModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = userTable;
