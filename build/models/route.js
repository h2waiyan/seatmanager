"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
// Model for user table
const routeModel = (sequelize, Sequelize) => {
    const route = sequelize.define('route', {
        route_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        gate_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        route_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        remark: {
            type: Sequelize.STRING,
        },
        route_isdeleted: {
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
    return route;
};
const routeTable = {};
routeTable.Sequelize = sequelize_1.Sequelize;
routeTable.sequelize = sequelize_2.default;
//create model
routeTable.services = routeModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = routeTable;
