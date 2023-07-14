import { Sequelize } from 'sequelize';
import sequelize from '../sequelize';

// Model for user table
const gateListModel = (sequelize: any, Sequelize: any) => {
    const gateList = sequelize.define('gateList', {

        gate_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        gate_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        gate_location: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        remark: {
            type: Sequelize.STRING,
        },
        gate_isdeleted: {
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

    return gateList;
};


const gateListTable: any = {};
gateListTable.Sequelize = Sequelize;
gateListTable.sequelize = sequelize;

//create model
gateListTable.services = gateListModel(sequelize, Sequelize);

module.exports = gateListTable;
