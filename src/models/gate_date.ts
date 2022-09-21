import { Sequelize } from 'sequelize';
import sequelize from '../sequelize';

// Model for user table
const gatedateModel = (sequelize: any, Sequelize: any) => {
  const gatedate = sequelize.define('gatedate', {
    userid: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gate_date_id : {
      type : Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    date : {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gate_id : {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gate_date_remark: {
      type: Sequelize.STRING,
    },
    gate_date_isdeleted : {
      type: Sequelize.BOOLEAN,
      defaultValue : false,
    },
    t1 : {
      type: Sequelize.STRING,
    },
    t2 : {
      type: Sequelize.STRING,
    },
    t3 : {
      type: Sequelize.STRING,
    }
  });

  return gatedate;
};


const gatedateTable: any = {};
gatedateTable.Sequelize = Sequelize;
gatedateTable.sequelize = sequelize;

//create model
gatedateTable.services = gatedateModel(sequelize, Sequelize);

module.exports = gatedateTable;
