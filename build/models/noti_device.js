"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
// Model for user table
const noti_deviceModel = (sequelize, Sequelize) => {
    const noti_device = sequelize.define('noti_device', {
        noti_device_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        userid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        uuid: {
            type: Sequelize.STRING,
        },
        fcmtoken: {
            type: Sequelize.STRING,
        }
    });
    return noti_device;
};
const noti_deviceTable = {};
noti_deviceTable.Sequelize = sequelize_1.Sequelize;
noti_deviceTable.sequelize = sequelize_2.default;
//create model
noti_deviceTable.services = noti_deviceModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = noti_deviceTable;
