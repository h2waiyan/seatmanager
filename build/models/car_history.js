"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const noti_setup = require('./noti_setup');
// Model for user table
const car_historyModel = (sequelize, Sequelize) => {
    const car_history = sequelize.define('car_history', {
        car_history_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        balance_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        go_trip: {
            type: Sequelize.INTEGER,
        },
        comeback_trip: {
            type: Sequelize.INTEGER,
        },
        petrol_price: {
            type: Sequelize.INTEGER,
        },
        khout_kyay: {
            type: Sequelize.INTEGER,
        },
        road_services: {
            type: Sequelize.INTEGER,
        },
        misc: {
            type: Sequelize.INTEGER,
        },
        total_amount: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        car_history_isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
    });
    return car_history;
};
const car_historyTable = {};
car_historyTable.Sequelize = sequelize_1.Sequelize;
car_historyTable.sequelize = sequelize_2.default;
//create model
car_historyTable.services = car_historyModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = car_historyTable;
