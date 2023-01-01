import { Sequelize } from 'sequelize';
import sequelize from '../sequelize';

const seatHistoryModel = (sequelize: any, Sequelize: any) => {
    const seats_history = sequelize.define('seats_history', {
        seat_history_id : {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        seat_id: {
            type: Sequelize.STRING,
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
        seat_isdeleted : {
            type : Sequelize.BOOLEAN,
            defaultValue : false,
        },
        ref_id : {
            type: Sequelize.STRING,
        },
        date_time : {
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

    return seats_history;
};



const seatHistoryTable: any = {};
seatHistoryTable.Sequelize = Sequelize;
seatHistoryTable.sequelize = sequelize;

//create model
seatHistoryTable.services = seatHistoryModel(sequelize, Sequelize);

module.exports = seatHistoryTable;
