import { Service, Inject } from 'typedi';
import Sequelize from "sequelize";
import AuthroizationCheck from './authorization_check';
import { Container } from 'typedi';
import { GetSeat, SeatManager } from '../interfaces/seat';
import { v4 as uuidv4 } from 'uuid';

@Service()
export default class CategoryService {
  constructor(
    @Inject('seatModel') private seatModel: any,
    @Inject('userModel') private userModel: any,
  ) {
  }

  // user create -> userid, category_id, category_type, category_name, category_remark
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

      var seat_nos = { "data": SeatManager.seat_no_array }

      const seat_id = "seat_id_" + uuidv4();
      const seatData = {
        ...SeatManager,
        seat_no_array: JSON.stringify(seat_nos),
        seat_id: seat_id,
      }

      console.log(">>>>>>>");
      console.log(seatData);

      var dataCheck: any;

      // await this.seatModel.services.findAll({
      //   where:
      //     { seat_id: seat_id, seat_isdeleted: false }
      // }).then((data: any) => {

      //   if (data.length > 0) {
      //     dataCheck = data[0]
      //   }
      // })

      // if (dataCheck) {
      //   const returncode = "300";
      //   const message = "Seat ID already exists. Try agian."
      //   return { returncode, message };
      // }

      var newRecord: any;
      await this.seatModel.services.create(seatData).then(
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

          if (data.length > 0) {

            var templist: any[] = [];
            data.map((item: any) => {

              var tempitem = {
                "seat_id": item.seat_id,
                "seat_no_array": JSON.parse(item.seat_no_array)['data'],
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


    const Op = Sequelize.Op;
    try {

    var seat_nos = { "data": SeatManager.seat_no_array }

      var result: any;
      var filter = { trip_id: SeatManager.trip_id, seat_isdeleted: false };
      var update = {
        ...SeatManager,
        seat_no_array: JSON.stringify(seat_nos),
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

      await this.seatModel.services
        .update(update, {
          where: filter,
        }).then((data: any) => {
          if (data) {
            if (data == 1) {
              result = { returncode: "200", message: 'Seat Updated successfully', data : {} };
            } else {
              result = { returncode: "300", message: 'Error upading or deleting seat', data : {} };
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
