import { Sequelize } from 'sequelize';
import sequelize from '../sequelize';

// Model for user table
const userModel = (sequelize: any, Sequelize: any) => {
  const users = sequelize.define('users', {
    userid: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    usertype : {
      type : Sequelize.INTEGER,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gate_id : {
      type: Sequelize.STRING,
    },
    service_fee_id : {
      type: Sequelize.STRING,
    },
    remark: {
      type: Sequelize.STRING,
    },
    isdeleted : {
      type: Sequelize.BOOLEAN,
      defaultValue : false,
    },
    sessionexpired : {
      type : Sequelize.BOOLEAN,
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

  return users;
};


const userTable: any = {};
userTable.Sequelize = Sequelize;
userTable.sequelize = sequelize;

//create model
userTable.services = userModel(sequelize, Sequelize);

module.exports = userTable;
