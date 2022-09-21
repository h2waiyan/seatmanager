import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import Sequelize from "sequelize";
import AuthroizationCheck from './authorization_check';
import { Container } from 'typedi';
import { GetTripInterface, TripInterface } from '../interfaces/trip';
import { v4 as uuidv4 } from 'uuid';

@Service()
export default class TripService {
  constructor(
    @Inject('tripModel') private tripModel: any,
    @Inject('userModel') private userModel: any,
  ) {
  }

  public async CreateTrip(TripInterface: TripInterface): Promise<{ returncode: string, message: string }> {

    var AuthrizationCheckService = Container.get(AuthroizationCheck);
    var userRecord = await AuthrizationCheckService.rootAdminCheck(TripInterface.userid);

    if (userRecord == "admin-not-found") {
      return { returncode: "300", message: "Admin Not Found" }
    }

    if (userRecord == "user-has-no-authorization") {
      return { returncode: "300", message: "User Had no authorization to create Category." }
    }

    try {

      var create_trip_list: any = [];

      for (let date_index = 0; date_index < TripInterface.date.length; date_index++) {
        for (let route_index = 0; route_index < TripInterface.route_id.length; route_index++) {
          for (let car_type_index = 0; car_type_index < TripInterface.car_type_id.length; car_type_index++) {

            const trip_id = "trip_id_" + uuidv4();

            const trip_data = {
              trip_id : trip_id,
              userid: TripInterface.userid,
              
              gate_id: TripInterface.gate_id,
              date: TripInterface.date[date_index],
              route_id : TripInterface.route_id[route_index],
              car_type_id : TripInterface.car_type_id[car_type_index],

              car_id : TripInterface.car_id,
              total_price : TripInterface.total_price,

              remark : TripInterface.remark,
              trip_isdeleted: TripInterface.trip_isdeleted,
            }

            create_trip_list.push(trip_data);
          }
        }
      }

      console.log(">>>>>>");
      console.log(create_trip_list);
      
      var dataCheck: any;

      var newRecord: any;
      await this.tripModel.services.bulkCreate(create_trip_list).then(
        (data: any) => {
          newRecord = data
        }
      )

      return { returncode: "200", message: "Success" };

    } catch (e) {
      console.log(e);
      return { returncode: "300", message: "Fail" };
    }
  }

  //to get category list -> userid, 
  public async GetTrips(GetTripInterface: GetTripInterface): Promise<{ returncode: string, message: string, data: any }> {

    const Op = Sequelize.Op;

    try {

      var userRecord: any;
      await this.userModel.services.findAll(
        { where: { userid: GetTripInterface.userid } }
      ).then((data: any) => {
        if (data.length > 0) {
          userRecord = data[0];
        }
      });

      if (!userRecord) {
        const returncode = "300";
        const message = "User Not Registered"
        var data: any;
        return { returncode, message, data };
      }
      try {

        var result: any;

        await this.tripModel.services.findAll({
          where:
            { gate_id : GetTripInterface.gate_id, 
              date: GetTripInterface.date, 
              route_id : GetTripInterface.route_id
            }
        }).then((data: any) => {

          if (data.length > 0) {
            const returncode = "200";
            const message = "Trip List"

            result = { returncode, message, data: data };
          } else {
            const returncode = "300";
            const message = "Trip List Not Found"
            var data: any;
            result = { returncode, message, data: {} };
          }
        });
        return result;
      } catch (e) {
        console.log(e);

        throw e;
      }

    } catch (e) {
      console.log(e);

      throw e;
    }
  }

  public async editCategory(TripInterface
    : TripInterface): Promise<{ returncode: string, message: string }> {

    var AuthrizationCheckService = Container.get(AuthroizationCheck);
    var userRecord = await AuthrizationCheckService.rootAdminCheck(TripInterface.userid);

    if (userRecord == "admin-not-found") {
      return { returncode: "300", message: "User Not Found" }
    }

    if (userRecord == "user-has-no-authorization") {
      return { returncode: "300", message: "User Had no authorization to create Category." }
    }

    const Op = Sequelize.Op;
    try {

      var result: any;
      var filter = { trip_id: TripInterface.trip_id, category_isdeleted: false };
      var update = {

        category_isdeleted: TripInterface.trip_isdeleted
      }

      await this.tripModel.services
        .update(update, {
          where: filter,
        }).then((data: any) => {
          if (data) {
            if (data == 1) {
              result = { returncode: "200", message: 'Category Updated successfully' };
            } else {
              result = { returncode: "300", message: 'Error upading or deleting category' };
            }
          }
        });
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

}