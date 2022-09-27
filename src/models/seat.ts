import { Sequelize } from 'sequelize';
import sequelize from '../sequelize';

const seatModel = (sequelize: any, Sequelize: any) => {
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
        seat_isdeleted : {
            type : Sequelize.BOOLEAN,
            defaultValue : false,
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



const seatTable: any = {};
seatTable.Sequelize = Sequelize;
seatTable.sequelize = sequelize;

//create model
seatTable.services = seatModel(sequelize, Sequelize);

module.exports = seatTable;
