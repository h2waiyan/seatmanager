"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const uuid_1 = require("uuid");
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize_2 = __importDefault(require("../sequelize"));
const Op = sequelize_1.default.Op;
let CategoryService = class CategoryService {
    constructor(seatHistoryModel, userModel) {
        this.seatHistoryModel = seatHistoryModel;
        this.userModel = userModel;
    }
    CreateSeatHistory(SeatManager) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seat_history_id = "seat_history_id_" + (0, uuid_1.v4)();
                var seatHistoryData;
                seatHistoryData = {
                    seat_history_id: seat_history_id,
                    trip_id: SeatManager.trip_id,
                    userid: SeatManager.userid,
                    customer_name: SeatManager.customer_name,
                    phone: SeatManager.phone,
                    seat_no_array: JSON.stringify(SeatManager.seat_no_array),
                    seat_status: SeatManager.seat_status,
                    date_time: "Test Date and Time",
                    seat_id: SeatManager.trip_id + JSON.stringify(SeatManager.seat_no_array),
                };
                var seatHistoryRecord;
                yield this.seatHistoryModel.services.create(seatHistoryData).then((data) => {
                    seatHistoryRecord = data;
                });
                return { returncode: "200", message: "Success" };
            }
            catch (e) {
                console.log(e);
                return { returncode: "300", message: "Fail" };
            }
        });
    }
    //to get category list -> userid, 
    GetSeatHistory(GetSeatHistory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var GetSeatHistoryQuery = `SELECT * FROM seats_histories 
          JOIN users ON seats_histories.userid = users.userid
          WHERE seats_histories.trip_id = '${GetSeatHistory.trip_id}';`;
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: GetSeatHistory.userid } }).then((data) => {
                    if (data.length > 0) {
                        userRecord = data;
                    }
                });
                if (!userRecord) {
                    const returncode = "300";
                    const message = "User Not Registered";
                    var data;
                    return { returncode, message, data };
                }
                try {
                    var result;
                    yield sequelize_2.default.query(GetSeatHistoryQuery).then((data) => {
                        if (data) {
                            var templist = [];
                            data[0].map((item) => {
                                var tempitem = {
                                    "customer_name": item.customer_name,
                                    "phone": item.phone,
                                    "seat_no_array": JSON.parse(item.seat_no_array),
                                    "trip_id": item.trip_id,
                                    "seat_status": item.seat_status,
                                    "userid": item.userid,
                                    "username": item.username,
                                    "date_time": item.date_time
                                };
                                templist.push(tempitem);
                            });
                            const returncode = "200";
                            const message = "Seat History List";
                            result = { returncode, message, data: templist };
                        }
                    });
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
                }
                catch (e) {
                    console.log(e);
                    throw e;
                }
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
};
CategoryService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('seatHistoryModel')),
    __param(1, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object, Object])
], CategoryService);
exports.default = CategoryService;
