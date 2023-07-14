import { Sequelize } from 'sequelize';
import sequelize from '../sequelize';

// Model for user table
const routeModel = (sequelize: any, Sequelize: any) => {
    const route = sequelize.define('route', {

        route_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        gate_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        route_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        remark: {
            type: Sequelize.STRING,
        },
        route_isdeleted: {
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

    return route;
};


const routeTable: any = {};
routeTable.Sequelize = Sequelize;
routeTable.sequelize = sequelize;

//create model
routeTable.services = routeModel(sequelize, Sequelize);

module.exports = routeTable;
