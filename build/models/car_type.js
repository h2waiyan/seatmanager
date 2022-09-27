"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
// Model for user table
const cartypeModel = (sequelize, Sequelize) => {
    const cartype = sequelize.define('cartype', {
        car_type_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        car_type_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        no_of_seats: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        remark: {
            type: Sequelize.STRING,
        },
        car_type_isdeleted: {
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
    return cartype;
};
const cartypeTable = {};
cartypeTable.Sequelize = sequelize_1.Sequelize;
cartypeTable.sequelize = sequelize_2.default;
//create model
cartypeTable.services = cartypeModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = cartypeTable;
