"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const categoryModel = require('./category');
// Model for user table
const noti_setupModel = (sequelize, Sequelize) => {
    const noti_setup = sequelize.define('noti_setup', {
        noti_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        category_id: {
            type: Sequelize.STRING,
        },
        keyword_id: {
            type: Sequelize.STRING,
        },
        noti_type: {
            type: Sequelize.INTEGER,
        },
        noti_data: {
            type: Sequelize.STRING,
        },
        start_date: {
            type: Sequelize.STRING,
        },
        is_sent: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        noti_isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
    });
    // Foo.hasOne(Bar, {
    //     foreignKey: 'myFooId'
    //   });
    //   Bar.belongsTo(Foo);
    // noti_setup.hasOne(categoryModel, { foreignKey : 'category_id'});
    return noti_setup;
};
const noti_setupTable = {};
noti_setupTable.Sequelize = sequelize_1.Sequelize;
noti_setupTable.sequelize = sequelize_2.default;
//create model
noti_setupTable.services = noti_setupModel(sequelize_2.default, sequelize_1.Sequelize);
module.exports = noti_setupTable;
