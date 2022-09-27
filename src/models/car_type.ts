import { Sequelize } from 'sequelize';
import sequelize from '../sequelize';

// Model for user table
const cartypeModel = (sequelize: any, Sequelize: any) => {
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


const cartypeTable: any = {};
cartypeTable.Sequelize = Sequelize;
cartypeTable.sequelize = sequelize;

//create model
cartypeTable.services = cartypeModel(sequelize, Sequelize);

module.exports = cartypeTable;
