"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
// Model for user table
const noti_historyModel = (sequelize, Sequelize) => {
    const noti_history = sequelize.define('noti_history', {
        noti_history_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        noti_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        userid: {
            type: Sequelize.STRING,
        },
        is_seen: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return noti_history;
};
const noti_historyTable = {};
noti_historyTable.Sequelize = sequelize_1.Sequelize;
noti_historyTable.sequelize = sequelize_2.default;
//create model
noti_historyTable.services = noti_historyModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = noti_historyTable;
