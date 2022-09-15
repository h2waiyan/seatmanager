"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
// Model for user table
const add_cashModel = (sequelize, Sequelize) => {
    const add_cash = sequelize.define('add_cash', {
        add_cash_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        cash_type: {
            type: Sequelize.INTEGER,
        },
        name: {
            type: Sequelize.STRING,
        },
        amount: {
            type: Sequelize.INTEGER,
        },
        add_date: {
            type: Sequelize.DATE,
        },
        from_date: {
            type: Sequelize.DATEONLY,
        },
        to_date: {
            type: Sequelize.DATEONLY,
        },
        cash_remark: {
            type: Sequelize.STRING,
        },
        userid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        add_cash_isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
    });
    return add_cash;
};
const add_cashTable = {};
add_cashTable.Sequelize = sequelize_1.Sequelize;
add_cashTable.sequelize = sequelize_2.default;
//create model
add_cashTable.services = add_cashModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = add_cashTable;
