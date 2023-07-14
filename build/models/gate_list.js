"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
// Model for user table
const gateListModel = (sequelize, Sequelize) => {
    const gateList = sequelize.define('gateList', {
        gate_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        gate_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        gate_location: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        remark: {
            type: Sequelize.STRING,
        },
        gate_isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        userid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        t1: {
            type: Sequelize.STRING,
        },
        t2: {
            type: Sequelize.STRING,
        },
        t3: {
            type: Sequelize.STRING,
        }
    });
    return gateList;
};
const gateListTable = {};
gateListTable.Sequelize = sequelize_1.Sequelize;
gateListTable.sequelize = sequelize_2.default;
//create model
gateListTable.services = gateListModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = gateListTable;
