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
    model: require('../models/trip'),
  }

  const seatModel = {
    name: 'seatModel',
    model: require('../models/seat'),
  };

    const seatHistoryModel = {
    name: 'seatHistoryModel',
    model: require('../models/seat_history'),
  };

  const cartypeModel = {
    name: 'cartypeModel',
    model: require('../models/car_type'),
  };

  const hashedPassword = await argon2.hash('TastySoft@091');

  userModel.model.sequelize.sync().then(function () {

    userModel.model.services.findAll({}).then((data: any) => {

      const systemadmindata = [
        {
          userid: "09265005353",
          username: 'admin',
          usertype: "1",
          password: hashedPassword
        },
        {
          userid: "09761315566",
          username: 'admin',
          usertype: "1",
          password: hashedPassword
        },
        {
          userid: "09258259091",
          username: 'admin',
          usertype: "1",
          password: hashedPassword
        }
      ]
      
      if (data.length == 0) {
        userModel.model.services.bulkCreate(systemadmindata);
      }
    });
  })

  cartypeModel.model.sequelize.sync().then(function () {
    cartypeModel.model.services.findAll({}).then((data: any) => {

      const van = 
        {
          car_type_id: "1",
          car_type_name: "Van",
          no_of_seats: 7,
          remark: "",
          car_type_isdeleted: false,
          userid: "09258259091"
        };
       const Noah7 = {
          car_type_id: "2",
          car_type_name: "Noah7",
          no_of_seats: 7,
          remark: "",
          car_type_isdeleted: false,
          userid: "09258259091"
        };
      
      if (data.length == 0) {
        cartypeModel.model.services.create(van);
        cartypeModel.model.services.create(Noah7);

      }
    });
  })

  // Set Containers for Dependency Injection
  await dependencyInjectorLoader({
    models: [
      userModel,
      tripModel,
      seatModel,
      seatHistoryModel,
      cartypeModel
    ],
  });

  await expressLoader({ app: expressApp });

};
