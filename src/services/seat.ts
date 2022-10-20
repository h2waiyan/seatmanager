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

    // var AuthrizationCheckService = Container.get(AuthroizationCheck);
    // var userRecord = await AuthrizationCheckService.rootAdminCheck(SeatManager.userid);

    // if (userRecord == "admin-not-found") {
    //   return { returncode: "300", message: "Admin Not Found" }
    // }

    // if (userRecord == "user-has-no-authorization") {
    //   return { returncode: "300", message: "User Had no authorization to create Category." }
    // }

    try {

      var seat_list: any = [];
      var backSeatList: any = [];
      var trip_total_price = 0;
      var seat_total_price = 0;

      var ref_id = "ref_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();

      for (let i = 0; i < SeatManager.seat_no_array.length; i++) {

        const seat_id = "seat_id_" + uuidv4();


        var seatData;
        var backSeatData;

        if (SeatManager.seat_no_array[i] == 1) {

          seat_total_price = SeatManager.total_price + 3000;

          seatData = {
            ...SeatManager,
            seat_id: seat_id,
            seat_no_array: SeatManager.seat_no_array[i],
            total_price: seat_total_price,
            ref_id: ref_id
          }

        }
        else {

          seat_total_price = SeatManager.total_price;

          seatData = {
            ...SeatManager,
            seat_id: seat_id,
            seat_no_array: SeatManager.seat_no_array[i],
            ref_id: ref_id,
          }
          // }

        }

        seat_list.push(seatData);

        trip_total_price = trip_total_price + seat_total_price;

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
                "ref_id": item.ref_id
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

  public async EditSeat(SeatManager
    : SeatManager): Promise<{ returncode: string, message: string, data: any }> {

    // var AuthrizationCheckService = Container.get(AuthroizationCheck);
    // var userRecord = await AuthrizationCheckService.rootAdminCheck(SeatManager.userid);

    // if (userRecord == "admin-not-found") {
    //   return { returncode: "300", message: "User Not Found", data: {} }
    // }

    // if (userRecord == "user-has-no-authorization") {
    //   return { returncode: "300", message: "User Had no authorization to edit seat.", data: {} }
    // }

    try {

      var seat_id_list = [];
      var seat_no_list = [];

      var new_seat_no_list = [];

      var front_price = 0;
      var front_id;
      var front_seat_update;
      var front_seat_filter;

      var ref_id = "ref_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();

      for (var i = 0; i < SeatManager.seat_id.length; i++) {

        if (SeatManager.seat_id[i]['seat_id'] == "") {
          new_seat_no_list.push(SeatManager.seat_id[i]['seat_no'])
        } else {
          seat_no_list.push(SeatManager.seat_id[i]['seat_no'])
          seat_id_list.push(SeatManager.seat_id[i]['seat_id'])

        }

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
            seat_isdeleted: SeatManager.seat_isdeleted,
            ref_id: ref_id
          }
        }

      }

      if (new_seat_no_list.length == 0) {

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
          seat_isdeleted: SeatManager.seat_isdeleted,
          ref_id: ref_id
        }

        var trip_total_price = seat_no_list.length * SeatManager.total_price;

        var trip_update = {
          seat_and_status: JSON.stringify(SeatManager.seat_and_status),
          total_price: trip_total_price + SeatManager.original_price
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
        // 1-open
        else if (SeatManager.seat_status == 1) {

          // for back of the back which is called nout-phone
          if (SeatManager.car_type == "1" && (seat_no_list.includes(5) || seat_no_list.includes(6) || seat_no_list.includes(7))) {
            console.log("နောက်ဖုံးကိစ္စများ−−−−−−")
          }
          // book, blocked, sold ကို open ပြန်ပြောင်းတာ
          else {
            var new_trip_update = {
              seat_and_status: JSON.stringify(SeatManager.seat_and_status),
            }

            console.log(
              ">>>>>>> HERE >>>>>"
            );


            var [seat_delete, seat_and_status_update] = await Promise
              .all(
                [
                  this.seatModel.services.destroy({ where: seat_filter }),
                  this.tripModel.services.update(new_trip_update, { where: trip_filter })
                ]
              )

            console.log(seat_delete);
            console.log(seat_and_status_update);

            if (seat_delete > 0 && seat_and_status_update.length > 0) {
              result = { returncode: "200", message: 'Seat Updated successfully', data: {} };
            } else {
              result = { returncode: "300", message: 'Error Upading Seat', data: {} };
            }

          }

        }
        // 4-sold
        else if (SeatManager.seat_status == 4) {

          if (seat_no_list.includes(1)) {

            trip_update = {
              seat_and_status: JSON.stringify(SeatManager.seat_and_status),
              total_price: trip_total_price + 3000 + SeatManager.original_price
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

        return result;

      } else {

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
          seat_isdeleted: SeatManager.seat_isdeleted,
          ref_id: ref_id

        }

        var trip_total_price = seat_no_list.length * SeatManager.total_price;

        var trip_update = {
          seat_and_status: JSON.stringify(SeatManager.seat_and_status),
          total_price: trip_total_price + SeatManager.original_price
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
            result = true;
            console.log(result);

          } else {
            result = false;
            console.log(result);

          }

        }

        // 1-open
        else if (SeatManager.seat_status == 1) {

          console.log("LLLLLLLLHRERE:::::::::");

          console.log(">>>>" +SeatManager.car_type + "<<<<<");

          console.log(seat_no_list.includes("5") || seat_no_list.includes("6") || seat_no_list.includes("7"));
          
          // for back of the back which is called nout-phone
          if (SeatManager.car_type == "1" && (seat_no_list.includes("5") || seat_no_list.includes("6") || seat_no_list.includes("7"))) {
            console.log("နောက်ဖုံးကိစ္စများ−−−−−−");
            var new_trip_update = {
              seat_and_status: JSON.stringify(SeatManager.seat_and_status),
            }

            var [seat_and_status_update] = await Promise
              .all(
                [
                  this.tripModel.services.update(new_trip_update, { where: trip_filter })
                ]
              )

            if (seat_and_status_update.length > 0) {
              result = true;
            } else {
              result = false;
            }
          }
          // book, blocked, sold ကို open ပြန်ပြောင်းတာ
          else {

            console.log("<<<<<<<<<");
            

            var new_trip_update = {
              seat_and_status: JSON.stringify(SeatManager.seat_and_status),
            }

            var [seat_delete, seat_and_status_update] = await Promise
              .all(
                [
                  this.seatModel.services.destroy({ where: seat_filter }),
                  this.tripModel.services.update(new_trip_update, { where: trip_filter })
                ]
              )

            console.log(seat_delete);
            console.log(seat_and_status_update.length)
            

            if (seat_delete > 0 && seat_and_status_update.length > 0) {
              result = true;
            } else {
              result = false;
            }

          }

        }

        // 4-sold
        else if (SeatManager.seat_status == 4) {

          if (seat_no_list.includes(1)) {

            trip_update = {
              seat_and_status: JSON.stringify(SeatManager.seat_and_status),
              total_price: trip_total_price + 3000 + SeatManager.original_price
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
              result = true;
            } else {
              result = false;
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
              result = true;
            } else {
              result = false;
            }
          }

        }

        try {

          var seat_list: any = [];
          var backSeatList: any = [];
          var trip_total_price = 0;
          var seat_total_price = 0;

          for (let i = 0; i < new_seat_no_list.length; i++) {

            const seat_id = "seat_id_" + uuidv4();

            var seatData;


            if (new_seat_no_list[i] == 1) {

              seat_total_price = SeatManager.total_price + 3000;

              seatData = {
                ...SeatManager,
                seat_id: seat_id,
                seat_no_array: new_seat_no_list[i],
                total_price: seat_total_price,
                ref_id: ref_id


              }

            }
            else {

              seat_total_price = SeatManager.total_price;

              seatData = {
                ...SeatManager,
                seat_id: seat_id,
                seat_no_array: new_seat_no_list[i],
                ref_id: ref_id
              }
            }

            seat_list.push(seatData);

            trip_total_price = trip_total_price + seat_total_price;

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

          var [seat_create, my_trip_update] = await Promise
            .all(
              [
                this.seatModel.services.bulkCreate(seat_list),
                // this.seatModel.services.update(backSeatList, { where: filter }),
                this.tripModel.services.update(update, { where: filter })
              ]
            )


          if (result == true && seat_create.length > 0 && my_trip_update.length > 0) {
            return { returncode: "200", message: "Success", data: {} };
          } else {
            return { returncode: "300", message: "Fail", data: {} };
          }


        } catch (e) {
          console.log(e);
          return { returncode: "300", message: "Fail", data: {} };
        }
      }

    } catch (e) {
      console.log(e);
      throw e;
    }
  }

}
