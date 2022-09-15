"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const noti_setup = require('./noti_setup');
// Model for user table
const balanceModel = (sequelize, Sequelize) => {
    const balance = sequelize.define('balance', {
        balance_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        category_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        balance_type: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        is_private: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        balance_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        keyword_id: {
            type: Sequelize.STRING,
        },
        car_inouttype: {
            type: Sequelize.INTEGER,
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        date: {
            type: Sequelize.DATEONLY,
        },
        balance_remark: {
            type: Sequelize.STRING,
        },
        userid: {
            type: Sequelize.STRING
        },
        balance_isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
    });
    return balance;
};
const balanceTable = {};
balanceTable.Sequelize = sequelize_1.Sequelize;
balanceTable.sequelize = sequelize_2.default;
//create model
balanceTable.services = balanceModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = balanceTable;
