"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const tripModel = (sequelize, Sequelize) => {
    const trips = sequelize.define('trips', {
        trip_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        route_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        date: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        gate_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        car_type_id: {
            type: Sequelize.STRING,
        },
        seat_and_status: {
            type: Sequelize.STRING,
        },
        car_id: {
            type: Sequelize.STRING,
        },
        total_price: {
            type: Sequelize.INTEGER,
        },
        userid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        remark: {
            type: Sequelize.STRING,
        },
        trip_isdeleted: {
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
    return trips;
};
const tripTable = {};
tripTable.Sequelize = sequelize_1.Sequelize;
tripTable.sequelize = sequelize_2.default;
//create model
tripTable.services = tripModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = tripTable;
