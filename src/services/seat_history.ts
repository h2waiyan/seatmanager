import { Service, Inject } from 'typedi';
import AuthroizationCheck from './authorization_check';
import { Container } from 'typedi';
import { GetSeat, GetSeatHistory, SeatManager } from '../interfaces/seat';
import { v4 as uuidv4 } from 'uuid';
import Sequelize, { and, Model, where } from "sequelize";
import { json } from 'body-parser';
import sequelize from '../sequelize';
const Op = Sequelize.Op;


@Service()
export default class CategoryService {
    constructor(
        @Inject('seatHistoryModel') private seatHistoryModel: any,
        @Inject('userModel') private userModel: any,
    ) {
    }

    public async CreateSeatHistory(SeatManager: SeatManager): Promise<{ returncode: string, message: string }> {

        try {

            const seat_history_id = "seat_history_id_" + uuidv4();

            var seatHistoryData;

            seatHistoryData = {

                seat_history_id: seat_history_id,
                trip_id: SeatManager.trip_id,
                userid: SeatManager.userid,
                seat_no_array: JSON.stringify(SeatManager.seat_no_array),
                seat_status: SeatManager.seat_status,
                date_time: "Test Date and Time",
                seat_id: SeatManager.trip_id + JSON.stringify(SeatManager.seat_no_array),
            }


            var seatHistoryRecord: any;
            await this.seatHistoryModel.services.create(seatHistoryData).then(
                (data: any) => {
                    seatHistoryRecord = data
                }
            )

            return { returncode: "200", message: "Success" };

        } catch (e) {
            console.log(e);
            return { returncode: "300", message: "Fail" };
        }
    }

    //to get category list -> userid, 
    public async GetSeatHistory(GetSeatHistory: GetSeatHistory): Promise<{ returncode: string, message: string, data: any }> {

        try {

            var GetSeatHistoryQuery = `SELECT * FROM seats_histories 
          JOIN users ON seats_histories.userid = users.userid
          WHERE seats_histories.trip_id = '${GetSeatHistory.trip_id}';`;

            var userRecord: any;
            await this.userModel.services.findAll(
                { where: { userid: GetSeatHistory.userid } }
            ).then((data: any) => {
                if (data.length > 0) {
                    userRecord = data;
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

                await sequelize.query(GetSeatHistoryQuery).then((data: any) => {

                    if (data) {

                        var templist: any[] = [];
                        data[0].map((item: any) => {

                            var tempitem = {

                                "seat_no_array": JSON.parse(item.seat_no_array),
                                "trip_id": item.trip_id,
                                "seat_status": item.seat_status,
                                "userid": item.userid,
                                "username" : item.username,
                                "date_time": item.date_time
                            };

                            templist.push(tempitem);

                        });

                        const returncode = "200";
                        const message = "Seat History List"

                        result = { returncode, message, data: templist };
                    }
                }
                );


                // await this.seatHistoryModel.services.findAll({
                //     where:
                //         { trip_id: GetSeatHistory.trip_id }
                // }).then((data: any) => {


                //     if (data.length > 0) {

                //         console.log(data[0]);

                //         var templist: any[] = [];
                //         data.map((item: any) => {

                //             var tempitem = {

                //                 "seat_no_array": JSON.parse(item.seat_no_array),
                //                 "trip_id": item.trip_id,
                //                 "seat_status": item.seat_status,
                //                 "userid": item.userid,
                //                 "date_time": item.date_time
                //             };

                //             templist.push(tempitem);

                //         });

                //         const returncode = "200";
                //         const message = "Seat History List"

                //         result = { returncode, message, data: templist };
                //     } else {
                //         const returncode = "300";
                //         const message = "Seat History list not found"
                //         var data: any;
                //         result = { returncode, message, data: {} };
                //     }
                // });
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



}
