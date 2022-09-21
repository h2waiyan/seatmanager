"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
// Model for user table
const gatedateModel = (sequelize, Sequelize) => {
    const gatedate = sequelize.define('gatedate', {
        userid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        gate_date_id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        date: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        gate_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        gate_date_remark: {
            type: Sequelize.STRING,
        },
        gate_date_isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
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
    return gatedate;
};
const gatedateTable = {};
gatedateTable.Sequelize = sequelize_1.Sequelize;
gatedateTable.sequelize = sequelize_2.default;
//create model
gatedateTable.services = gatedateModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = gatedateTable;
