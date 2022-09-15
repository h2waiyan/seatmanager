"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const noti_setup = require('./noti_setup');
// Model for user table
const categoryModel = (sequelize, Sequelize) => {
    const category = sequelize.define('category', {
        category_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        category_type: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        category_icon: {
            type: Sequelize.STRING,
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
    // category.belongs(noti_setup);
    return category;
};
const categoryTable = {};
categoryTable.Sequelize = sequelize_1.Sequelize;
categoryTable.sequelize = sequelize_2.default;
//create model
categoryTable.services = categoryModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = categoryTable;
