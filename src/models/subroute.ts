import { Sequelize } from 'sequelize';
import sequelize from '../sequelize';

// Model for user table
const subrouteModel = (sequelize: any, Sequelize: any) => {
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


const subrouteTable: any = {};
subrouteTable.Sequelize = Sequelize;
subrouteTable.sequelize = sequelize;

//create model
subrouteTable.services = subrouteModel(sequelize, Sequelize);

module.exports = subrouteTable;
