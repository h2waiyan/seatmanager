"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
// Model for user table
const debt_listModel = (sequelize, Sequelize) => {
    const debt_list = sequelize.define('debt_list', {
        debt_list_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        debt_type: {
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
        due_date: {
            type: Sequelize.DATEONLY,
        },
        remark: {
            type: Sequelize.STRING,
        },
        debt_isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
    });
    return debt_list;
};
const debt_listTable = {};
debt_listTable.Sequelize = sequelize_1.Sequelize;
debt_listTable.sequelize = sequelize_2.default;
//create model
debt_listTable.services = debt_listModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = debt_listTable;
