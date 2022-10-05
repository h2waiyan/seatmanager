import { Sequelize } from 'sequelize';
import sequelize from '../sequelize';

const tripModel = (sequelize: any, Sequelize: any) => {
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
        seat_and_status : {
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



const tripTable: any = {};
tripTable.Sequelize = Sequelize;
tripTable.sequelize = sequelize;

//create model
tripTable.services = tripModel(sequelize, Sequelize);

module.exports = tripTable;
