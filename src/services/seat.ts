import { Service, Inject } from 'typedi';
// import { Sequelize } from "sequelize";
import AuthroizationCheck from './authorization_check';
import { Container } from 'typedi';
import { GetSeat, SeatManager } from '../interfaces/seat';
import { v4 as uuidv4 } from 'uuid';
// const { Op } = require("sequelize");
import Sequelize, { and, Model, where } from "sequelize";
import { json } from 'body-parser';
const Op = require('Sequelize').Op
// import sequelize from '../sequelize';

@Service()
export default class CategoryService {
  constructor(
    @Inject('seatModel') private seatModel: any,
    @Inject('tripModel') private tripModel: any,
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
      var trip_total_price = 0;
      var seat_total_price = 0;

      for (let i = 0; i < SeatManager.seat_no_array.length; i++) {

        const seat_id = "seat_id_" + uuidv4();

        var seatData;

        if (SeatManager.seat_no_array[i] == 1 ) {

          seat_total_price =  SeatManager.total_price + 3000;

          seatData = {
            ...SeatManager,
            seat_id: seat_id,
            seat_no_array: SeatManager.seat_no_array[i],
            total_price: seat_total_price
          }

        } else {

          seat_total_price = SeatManager.total_price;

          seatData = {
            ...SeatManager,
            seat_id: seat_id,
            seat_no_array: SeatManager.seat_no_array[i],
          }


        }

        seat_list.push(seatData);

        trip_total_price =  trip_total_price + seat_total_price;

      }

      trip_total_price = trip_total_price + SeatManager.original_price;

      var update;

      // buy
      if (SeatManager.seat_status == 4) {
        update = {
          seat_and_status: JSON.stringify(SeatManager.seat_and_status),
          total_price: trip_total_price
        };
      } else {
        update = {
          seat_and_status: JSON.stringify(SeatManager.seat_and_status)
        };
      }

      var filter = { trip_id: SeatManager.trip_id };

      var [seat_create, trip_update] = await Promise
        .all(
          [
            this.seatModel.services.bulkCreate(seat_list),
            this.tripModel.services.update(update, { where: filter })
          ]
        )

      console.log(seat_create.length);
      console.log(trip_update.length);


      if (seat_create.length > 0 && trip_update.length > 0) {
        return { returncode: "200", message: "Success" };
      } else {
        return { returncode: "300", message: "Fail" };

      }


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


          if (data.length > 0) {

            console.log(data[0]);

            var templist: any[] = [];
            data.map((item: any) => {

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

      var seat_id_list = [];
      var seat_no_list = [];
      var front_price = 0;
      var front_id;
      var front_seat_update;
      var front_seat_filter;

      for (var i = 0; i < SeatManager.seat_id.length; i++) {

        seat_id_list.push(SeatManager.seat_id[i]['seat_id'])
        seat_no_list.push(SeatManager.seat_id[i]['seat_no'])

        if (SeatManager.seat_id[i]['seat_no'] == 1) {

          front_price = front_price + SeatManager.total_price + 3000;

          front_seat_filter = { trip_id: SeatManager.trip_id, seat_id: SeatManager.seat_id[i]['seat_id'], seat_isdeleted: false };

          front_id = SeatManager.seat_id[i];

          front_seat_update = {
            trip_id: SeatManager.trip_id,
            sub_route_id: SeatManager.sub_route_id,
            seat_status: SeatManager.seat_status,
            total_price: front_price,
            customer_name: SeatManager.customer_name,
            discount: SeatManager.discount,
            phone: SeatManager.phone,
            gender: SeatManager.gender,
            pickup_place: SeatManager.pickup_place,
            remark: SeatManager.remark,
            userid: SeatManager.userid,
            seat_isdeleted: SeatManager.seat_isdeleted
          }
        }


      }

      var result: any;
      var seat_filter = { trip_id: SeatManager.trip_id, seat_id: { [Op.or]: seat_id_list }, seat_isdeleted: false };

      var seat_update = {
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

      var trip_total_price = seat_no_list.length * SeatManager.total_price;

      var trip_update = {
        seat_and_status: JSON.stringify(SeatManager.seat_and_status),
        total_price : trip_total_price + SeatManager.original_price
      }

      var trip_filter = { trip_id: SeatManager.trip_id }

      // 2-blocked and 3-booked
      if (SeatManager.seat_status == 2 || SeatManager.seat_status == 3) {

        var [seat_edit, seat_and_status_update] = await Promise
          .all(
            [
              this.seatModel.services.update(seat_update, { where: seat_filter }),
              this.tripModel.services.update(trip_update, { where: trip_filter })
            ]
          )

        if (seat_edit.length > 0 && seat_and_status_update.length > 0) {
          result = { returncode: "200", message: 'Seat Updated successfully', data: {} };
        } else {
          result = { returncode: "300", message: 'Error Upading Seat', data: {} };
        }

      }

      // 1-open and if နောက်ဖုံး
      else if (SeatManager.seat_status == 1 && SeatManager.car_type == "1") {
        // for back of the back which is called nout-phone
      }

      else if (SeatManager.seat_status == 4) {

        // if (SeatManager.customer_name == null || ""
        //   || SeatManager.gender == null || ""
        // ) {
        //   result = { returncode: "300", message: 'Customer အမည်နှင့် ကျား/မ ဖြည့်ပါ', data: {} };
        //   return result;
        // }
        
        if (seat_no_list.includes(1)) {

          trip_update = {
            seat_and_status: JSON.stringify(SeatManager.seat_and_status),
            total_price : trip_total_price + 3000 + SeatManager.original_price
          }
          
          var [seat_edit, seat_and_status_update] = await Promise
            .all(
              [
                this.seatModel.services.update(seat_update, { where: seat_filter }),
                this.tripModel.services.update(trip_update, { where: trip_filter }),
                this.seatModel.services.update(front_seat_update, { where: front_seat_filter }),
              ]
            )

          if (seat_edit.length > 0 && seat_and_status_update.length > 0) {
            result = { returncode: "200", message: 'Seat Updated successfully', data: {} };
          } else {
            result = { returncode: "300", message: 'Error Upading Seat', data: {} };
          }
        } else {
          var [seat_edit, seat_and_status_update] = await Promise
            .all(
              [
                this.seatModel.services.update(seat_update, { where: seat_filter }),
                this.tripModel.services.update(trip_update, { where: trip_filter })
              ]
            )

          if (seat_edit.length > 0 && seat_and_status_update.length > 0) {
            result = { returncode: "200", message: 'Seat Updated successfully', data: {} };
          } else {
            result = { returncode: "300", message: 'Error Upading Seat', data: {} };
          }
        }

      }

      else {
        await this.seatModel.services
          .destroy({
            where: seat_filter,
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
