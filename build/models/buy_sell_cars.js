"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
// Model for user table
const buy_sell_carsModel = (sequelize, Sequelize) => {
    const buy_sell_cars = sequelize.define('buy_sell_cars', {
        buy_sell_cars_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        buy_sell_type: {
            type: Sequelize.INTEGER,
        },
        car_no: {
            type: Sequelize.STRING,
        },
        car_type: {
            type: Sequelize.STRING,
        },
        amount: {
            type: Sequelize.INTEGER,
        },
        add_date: {
            type: Sequelize.DATE,
        },
        remark: {
            type: Sequelize.STRING,
        },
        buy_sell_cars_isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
    });
    return buy_sell_cars;
};
const buy_sell_carsTable = {};
buy_sell_carsTable.Sequelize = sequelize_1.Sequelize;
buy_sell_carsTable.sequelize = sequelize_2.default;
//create model
buy_sell_carsTable.services = buy_sell_carsModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = buy_sell_carsTable;
