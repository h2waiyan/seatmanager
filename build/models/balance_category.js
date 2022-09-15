"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
// Model for user table
const balanceCategoryModel = (sequelize, Sequelize) => {
    const balanceCategory = sequelize.define('balanceCategory', {
        category_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        category_type: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        category_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        category_remark: {
            type: Sequelize.STRING,
        },
        category_isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
    });
    return balanceCategory;
};
const balanceCategoryTable = {};
balanceCategoryTable.Sequelize = sequelize_1.Sequelize;
balanceCategoryTable.sequelize = sequelize_2.default;
//create model
balanceCategoryTable.services = balanceCategoryModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = balanceCategoryTable;
