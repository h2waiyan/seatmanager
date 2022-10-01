import { Service, Inject } from 'typedi';
// import { Sequelize } from "sequelize";
import AuthroizationCheck from './authorization_check';
import { Container } from 'typedi';
import { GetSeat, SeatManager } from '../interfaces/seat';
import { v4 as uuidv4 } from 'uuid';
// const { Op } = require("sequelize");
import Sequelize, { Model } from "sequelize";
const Op = require('Sequelize').Op
// import sequelize from '../sequelize';

@Service()
export default class CategoryService {
  constructor(
    @Inject('seatModel') private seatModel: any,
    @Inject('userModel') private userModel: any,
  ) {
  }

  public async CreateSeat(SeatManager: SeatManager): Promise<{ returncode: string, message: string }> {

    var AuthrizationCheckService = Container.get(AuthroizationCheck);
    var userRecord = await AuthrizationCheckService.rootAdminCheck(SeatManager.userid);

    if (userRecord == "admin-not-found") {
      return { returncode: "300", message: "Admin Not Found" }
    }

    if (userRecord == "user-has-no-authorization") {
      return { returncode: "300", message: "User Had no authorization to create Category." }
    }

    try {

      var seat_list: any = [];

      for (let i = 0; i < SeatManager.seat_no_array.length; i++) {
        const seat_id = "seat_id_" + uuidv4();

        const seatData = {
          ...SeatManager,
          seat_id: seat_id,
          seat_no_array: SeatManager.seat_no_array[i],
        }

        seat_list.push(seatData);

      }

      var dataCheck: any;

      var newRecord: any;
      await this.seatModel.services.bulkCreate(seat_list).then(
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
  public async GetSeats(GetSeat: GetSeat): Promise<{ returncode: string, message: string, data: any }> {

    try {

      var userRecord: any;
      await this.userModel.services.findAll(
        { where: { userid: GetSeat.userid } }
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

        await this.seatModel.services.findAll({
          where:
            { trip_id: GetSeat.trip_id }
        }).then((data: any) => {

          console.log("------");
          console.log(data);
          

          if (data.length > 0) {

            console.log("0000000");
            console.log(data);
            

            var templist: any[] = [];
            data.map((item: any) => {


              console.log("????????");
              
              console.log(item);

              var tempitem = {
                "seat_id": item.seat_id,
                "seat_no_array": item.seat_no_array,
                "trip_id": item.trip_id,
                "sub_route_id": item.sub_route_id,
                "seat_status": item.seat_status,
                "total_price": item.total_price,
                "customer_name": item.customer_name,
                "discount": item.discount,
                "phone": item.phone,
                "gender": item.gender,
                "pickup_place": item.pickup_place,
                "remark": item.remark,
                "userid": item.userid,
                "seat_isdeleted": item.seat_isdeleted,
              };

              templist.push(tempitem);

            });

            data = templist;
            const returncode = "200";
            const message = "Seat List"

            result = { returncode, message, data: data };
          } else {
            const returncode = "300";
            const message = "Seat list not found"
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

  public async editSeat(SeatManager
    : SeatManager): Promise<{ returncode: string, message: string, data: any }> {

    var AuthrizationCheckService = Container.get(AuthroizationCheck);
    var userRecord = await AuthrizationCheckService.rootAdminCheck(SeatManager.userid);

    if (userRecord == "admin-not-found") {
      return { returncode: "300", message: "User Not Found", data: {} }
    }

    if (userRecord == "user-has-no-authorization") {
      return { returncode: "300", message: "User Had no authorization to create Category.", data: {} }
    }

    try {

      var result: any;
      var filter = { trip_id: SeatManager.trip_id, seat_id: { [Op.or]: SeatManager.seat_id }, seat_isdeleted: false };

      var update = {
        trip_id: SeatManager.trip_id,
        sub_route_id: SeatManager.sub_route_id,
        seat_status: SeatManager.seat_status,
        total_price: SeatManager.total_price,
        customer_name: SeatManager.customer_name,
        discount: SeatManager.discount,
        phone: SeatManager.phone,
        gender: SeatManager.gender,
        pickup_place: SeatManager.pickup_place,
        remark: SeatManager.remark,
        userid: SeatManager.userid,
        seat_isdeleted: SeatManager.seat_isdeleted
      }

      // if (SeatManager.seat_status == 4) {
      //   if (SeatManager.customer_name == null || ""
      //     || SeatManager.gender == null || ""
      //   ) {
      //     result = { returncode: "300", message: 'Customer အမည်နှင့် ကျား/မ ဖြည့်ပါ', data : {} };
      //   }
      //   return result;
      // }

      if (SeatManager.seat_status != 1) {

        await this.seatModel.services
          .update(update, {
            where: filter,
          }).then((data: any) => {
            if (data) {
              console.log(">>>>>>>>>", data);
              if (data > 0) {
                result = { returncode: "200", message: 'Seat Updated successfully', data: {} };
              } else {
                result = { returncode: "300", message: 'Error Upading Seat', data: {} };
              }
            }
            
          });

      } else {
        await this.seatModel.services
          .destroy({
            where: filter,
          }).then((data: any) => {
            console.log(data);
            
            if (data) {
              console.log(">>>>>>>>>", data);
              if (data > 0) {
                result = { returncode: "200", message: 'Seat Deleted successfully', data: {} };
              } else {
                result = { returncode: "300", message: 'Error Deleting Seat', data: {} };
              }
            }
          });

        }
      
      return result;

    } catch (e) {
      console.log(e);
      throw e;
    }
  }

}
