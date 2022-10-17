"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const seatModel = (sequelize, Sequelize) => {
    const seats = sequelize.define('seats', {
        seat_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        seat_no_array: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        trip_id: {
            type: Sequelize.STRING,
        },
        sub_route_id: {
            type: Sequelize.STRING,
        },
        seat_status: {
            type: Sequelize.INTEGER,
        },
        total_price: {
            type: Sequelize.INTEGER,
        },
        customer_name: {
            type: Sequelize.STRING,
        },
        discount: {
            type: Sequelize.INTEGER,
        },
        phone: {
            type: Sequelize.STRING,
        },
        gender: {
            type: Sequelize.INTEGER,
        },
        pickup_place: {
            type: Sequelize.STRING,
        },
        remark: {
            type: Sequelize.STRING,
        },
        userid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        seat_isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        ref_id: {
            type: Sequelize.STRING,
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
    return seats;
};
const seatTable = {};
seatTable.Sequelize = sequelize_1.Sequelize;
seatTable.sequelize = sequelize_2.default;
//create model
seatTable.services = seatModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = seatTable;
