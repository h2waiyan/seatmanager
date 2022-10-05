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
// import { Sequelize } from "sequelize";
const authorization_check_1 = __importDefault(require("./authorization_check"));
const typedi_2 = require("typedi");
const uuid_1 = require("uuid");
const Op = require('Sequelize').Op;
// import sequelize from '../sequelize';
let CategoryService = class CategoryService {
    constructor(seatModel, tripModel, userModel) {
        this.seatModel = seatModel;
        this.tripModel = tripModel;
        this.userModel = userModel;
    }
    CreateSeat(SeatManager) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.rootAdminCheck(SeatManager.userid);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "Admin Not Found" };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create Category." };
            }
            try {
                var seat_list = [];
                for (let i = 0; i < SeatManager.seat_no_array.length; i++) {
                    const seat_id = "seat_id_" + (0, uuid_1.v4)();
                    const seatData = Object.assign(Object.assign({}, SeatManager), { seat_id: seat_id, seat_no_array: SeatManager.seat_no_array[i] });
                    seat_list.push(seatData);
                }
                var update = {
                    seat_and_status: JSON.stringify(SeatManager.seat_and_status)
                };
                console.log(update);
                var filter = { trip_id: SeatManager.trip_id };
                var [seat_create, trip_update] = yield Promise
                    .all([
                    this.seatModel.services.bulkCreate(seat_list),
                    this.tripModel.services.update(update, { where: filter })
                ]);
                console.log(seat_create.length);
                console.log(trip_update.length);
                if (seat_create.length > 0 && trip_update.length > 0) {
                    return { returncode: "200", message: "Success" };
                }
                else {
                    return { returncode: "300", message: "Fail" };
                }
            }
            catch (e) {
                console.log(e);
                return { returncode: "300", message: "Fail" };
            }
        });
    }
    //to get category list -> userid, 
    GetSeats(GetSeat) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: GetSeat.userid } }).then((data) => {
                    if (data.length > 0) {
                        userRecord = data[0];
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
                    yield this.seatModel.services.findAll({
                        where: { trip_id: GetSeat.trip_id }
                    }).then((data) => {
                        if (data.length > 0) {
                            console.log(data[0]);
                            var templist = [];
                            data.map((item) => {
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
                            const message = "Seat List";
                            result = { returncode, message, data: data };
                        }
                        else {
                            const returncode = "300";
                            const message = "Seat list not found";
                            var data;
                            result = { returncode, message, data: {} };
                        }
                    });
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
    editSeat(SeatManager) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.rootAdminCheck(SeatManager.userid);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "User Not Found", data: {} };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create Category.", data: {} };
            }
            try {
                var result;
                var seat_filter = { trip_id: SeatManager.trip_id, seat_id: { [Op.or]: SeatManager.seat_id }, seat_isdeleted: false };
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
                };
                var trip_update = {
                    seat_and_status: JSON.stringify(SeatManager.seat_and_status)
                };
                var trip_filter = { trip_id: SeatManager.trip_id };
                // if (SeatManager.seat_status == 4) {
                //   if (SeatManager.customer_name == null || ""
                //     || SeatManager.gender == null || ""
                //   ) {
                //     result = { returncode: "300", message: 'Customer အမည်နှင့် ကျား/မ ဖြည့်ပါ', data : {} };
                //   }
                //   return result;
                // }
                if (SeatManager.seat_status != 1) {
                    var [seat_edit, seat_and_status_update] = yield Promise
                        .all([
                        this.seatModel.services.update(seat_update, { where: seat_filter }),
                        this.tripModel.services.update(trip_update, { where: trip_filter })
                    ]);
                    if (seat_edit.length > 0 && seat_and_status_update.length > 0) {
                        result = { returncode: "200", message: 'Seat Updated successfully', data: {} };
                    }
                    else {
                        result = { returncode: "300", message: 'Error Upading Seat', data: {} };
                    }
                }
                else if (SeatManager.seat_status == 1 && SeatManager.car_type == "1") {
                    // for back of the back which is called nout-phone
                }
                else {
                    yield this.seatModel.services
                        .destroy({
                        where: seat_filter,
                    }).then((data) => {
                        console.log(data);
                        if (data) {
                            console.log(">>>>>>>>>", data);
                            if (data > 0) {
                                result = { returncode: "200", message: 'Seat Deleted successfully', data: {} };
                            }
                            else {
                                result = { returncode: "300", message: 'Error Deleting Seat', data: {} };
                            }
                        }
                    });
                }
                return result;
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
    __param(0, (0, typedi_1.Inject)('seatModel')),
    __param(1, (0, typedi_1.Inject)('tripModel')),
    __param(2, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object, Object, Object])
], CategoryService);
exports.default = CategoryService;
