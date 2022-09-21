import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import argon2 from 'argon2';

export default async ({ expressApp }: { expressApp: any }) => {

  const userModel = {
    name: 'userModel',
    model: require('../models/user'),
  };

  const tripModel = {
    name: 'tripModel',
    model : require('../models/trip'),
  }

  const seatModel = {
    name: 'seatModel',
    model: require('../models/seat'),
  };

  const gatedateModel = {
    name: 'gatedateModel',
    model: require('../models/gate_date'),
  };

  const hashedPassword = await argon2.hash('TastySoft@091');
  // create table
  // userModel.model.sequelize.sync();
  
  userModel.model.sequelize.sync().then(function () {

    userModel.model.services.findAll({}).then((data: any) => {

      const systemadmindata =
      {
        userid: "09258259091",
        username: 'admin',
        usertype: "1",
        password: hashedPassword
      };

      const heingpadmin = {
        userid: "09761315566",
        username: 'admin',
        usertype: "1",
        password: hashedPassword
      }

      if (data.length == 0) {
        userModel.model.services.create(systemadmindata);
        userModel.model.services.create(heingpadmin);
      }
    });
  })

  // Set Containers for Dependency Injection
  await dependencyInjectorLoader({
    models: [
      userModel,
      tripModel,
      seatModel,
      gatedateModel
    ],
  });

  await expressLoader({ app: expressApp });

};
