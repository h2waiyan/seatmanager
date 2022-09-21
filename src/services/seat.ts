import { Service, Inject } from 'typedi';
import Sequelize from "sequelize";
import AuthroizationCheck from './authorization_check';
import { Container } from 'typedi';
import { GetSeat, SeatManager } from '../interfaces/seat';

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

      const seat_id = "seat_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
      const seatData = {
        ...SeatManager,
        seat_id: seat_id,
      }

      console.log(">>>>>>>");
      console.log(seatData);

      var dataCheck: any;

      await this.seatModel.services.findAll({
        where:
          { seat_id: seat_id, seat_isdeleted: false }
      }).then((data: any) => {

        if (data.length > 0) {
          dataCheck = data[0]
        }
      })

      if (dataCheck) {
        const returncode = "300";
        const message = "Seat ID already exists. Try agian."
        return { returncode, message };
      }

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
            { trip_id : GetSeat.trip_id }
        }).then((data: any) => {
  
          if (data.length > 0) {

            // var templist: any[] = [];
            // data.map((item: any) => {

            //   var tempitem = {
            //     category_id: item.category_id,
            //     category_type: item.category_type,
            //     category_icon: item.category_icon,
            //     category_name: item.category_name,
            //     category_iconplusname: item.category_icon + " " + item.category_name,
            //     category_remark: item.category_remark
            //   };

            //   templist.push(tempitem);

            // });

            // data = templist;
            const returncode = "200";
            const message = "Seat List"

            result = { returncode, message, data : data };
          } else {
            const returncode = "300";
            const message = "Seat list not found"
            var data: any;
            result = { returncode, message, data : {} };
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

  public async editCategory(SeatManager
    : SeatManager): Promise<{ returncode: string, message: string }> {

    var AuthrizationCheckService = Container.get(AuthroizationCheck);
    var userRecord = await AuthrizationCheckService.rootAdminCheck(SeatManager.userid);

    if (userRecord == "admin-not-found") {
      return { returncode: "300", message: "User Not Found" }
    }

    if (userRecord == "user-has-no-authorization") {
      return { returncode: "300", message: "User Had no authorization to create Category." }
    }

    const Op = Sequelize.Op;
    try {

      var result: any;
      var filter = { category_id: SeatManager.seat_id, category_isdeleted: false };
      var update = {

        category_isdeleted: SeatManager.seat_isdeleted
      }

      await this.seatModel.services
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
