"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
// Model for user table
const keywordModel = (sequelize, Sequelize) => {
    const keyword = sequelize.define('keyword', {
        keyword_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        keyword_icon: {
            type: Sequelize.STRING,
        },
        keyword_name: {
            type: Sequelize.STRING,
        },
        keyword_isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
    });
    return keyword;
};
const keywordTable = {};
keywordTable.Sequelize = sequelize_1.Sequelize;
keywordTable.sequelize = sequelize_2.default;
//create model
keywordTable.services = keywordModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = keywordTable;
