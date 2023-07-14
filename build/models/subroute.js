"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
// Model for user table
const subrouteModel = (sequelize, Sequelize) => {
    const subroute = sequelize.define('subroute', {
        subroute_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        route_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        subroute_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        car_type_id: {
            type: Sequelize.STRING,
        },
        front_seat_price: {
            type: Sequelize.STRING,
        },
        back_seat_price: {
            type: Sequelize.STRING,
        },
        remark: {
            type: Sequelize.STRING,
        },
        subroute_isdeleted: {
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
    return subroute;
};
const subrouteTable = {};
subrouteTable.Sequelize = sequelize_1.Sequelize;
subrouteTable.sequelize = sequelize_2.default;
//create model
subrouteTable.services = subrouteModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = subrouteTable;
