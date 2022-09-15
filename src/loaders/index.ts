import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import argon2 from 'argon2';

export default async ({ expressApp }: { expressApp: any }) => {

  const userModel = {
    name: 'userModel',
    model: require('../models/user'),
  };

  const hashedPassword = await argon2.hash('admin');
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
    ],
  });

  await expressLoader({ app: expressApp });

};
