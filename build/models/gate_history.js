"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const noti_setup = require('./noti_setup');
// Model for user table
const gate_historyModel = (sequelize, Sequelize) => {
    const gate_history = sequelize.define('gate_history', {
        gate_history_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        balance_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        car_no: {
            type: Sequelize.STRING,
        },
        car_amount: {
            type: Sequelize.INTEGER,
        },
        trip_type: {
            type: Sequelize.INTEGER,
        },
        gate_history_isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
    });
    return gate_history;
};
const gate_historyTable = {};
gate_historyTable.Sequelize = sequelize_1.Sequelize;
gate_historyTable.sequelize = sequelize_2.default;
//create model
gate_historyTable.services = gate_historyModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = gate_historyTable;
