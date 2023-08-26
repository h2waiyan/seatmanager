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
const Op = sequelize_1.default.Op;
let CategoryService = class CategoryService {
    constructor(seatModel, tripModel, userModel, seatHistoryModel) {
        this.seatModel = seatModel;
        this.tripModel = tripModel;
        this.userModel = userModel;
        this.seatHistoryModel = seatHistoryModel;
    }
    CreateSeat(SeatManager) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var trip_original_price = 0;
                yield this.tripModel.services.findAll({ where: { trip_id: SeatManager.trip_id, trip_isdeleted: false } }).then((data) => {
                    if (data) {
                        trip_original_price = data[0]['total_price'];
                    }
                });
                var seat_list = [];
                var backSeatList = [];
                var trip_total_price = 0;
                var seat_total_price = 0;
                var ref_id = "ref_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                const seat_history_id = "seat_history_id_" + (0, uuid_1.v4)();
                var seatHistoryData;
                seatHistoryData = {
                    seat_history_id: seat_history_id,
                    trip_id: SeatManager.trip_id,
                    userid: SeatManager.userid,
                    seat_no_array: JSON.stringify(SeatManager.seat_no_array),
                    seat_status: SeatManager.seat_status,
                    date_time: SeatManager.date_time,
                    seat_id: SeatManager.trip_id + JSON.stringify(SeatManager.seat_no_array),
                };
                for (let i = 0; i < SeatManager.seat_no_array.length; i++) {
                    const seat_id = "seat_id_" + (0, uuid_1.v4)();
                    var seatData;
                    var backSeatData;
                    if (SeatManager.seat_no_array[i] == "1") {
                        seat_total_price = SeatManager.front_seat_price - SeatManager.discount;
                        seatData = Object.assign(Object.assign({}, SeatManager), { seat_id: seat_id, seat_no_array: SeatManager.seat_no_array[i], total_price: SeatManager.seat_status == 4 ? SeatManager.front_seat_price - SeatManager.discount : 0, ref_id: ref_id });
                    }
                    else {
                        seat_total_price = SeatManager.back_seat_price - SeatManager.discount;
                        seatData = Object.assign(Object.assign({}, SeatManager), { total_price: SeatManager.seat_status == 4 ? SeatManager.back_seat_price - SeatManager.discount : 0, seat_id: seat_id, seat_no_array: SeatManager.seat_no_array[i], ref_id: ref_id });
                        // }
                    }
                    seat_list.push(seatData);
                    trip_total_price = trip_total_price + seat_total_price;
                }
                trip_total_price = trip_total_price + trip_original_price;
                var update;
                // buy
                if (SeatManager.seat_status == 4) {
                    update = {
                        seat_and_status: JSON.stringify(SeatManager.seat_and_status),
                        total_price: trip_total_price
                    };
                }
                else {
                    update = {
                        seat_and_status: JSON.stringify(SeatManager.seat_and_status)
                    };
                }
                var filter = { trip_id: SeatManager.trip_id };
                var [seat_create, trip_update, seat_history_create] = yield Promise
                    .all([
                    this.seatModel.services.bulkCreate(seat_list),
                    this.tripModel.services.update(update, { where: filter }),
                    this.seatHistoryModel.services.create(seatHistoryData)
                ]);
                if (seat_create.length > 0 && trip_update.length > 0 && seat_history_create) {
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
                                    "ref_id": item.ref_id
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
    EditSeat(SeatManager) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var trip_original_price = 0;
                yield this.tripModel.services.findAll({ where: { trip_id: SeatManager.trip_id, trip_isdeleted: false } }).then((data) => {
                    if (data) {
                        trip_original_price = data[0]['total_price'];
                    }
                });
                console.log("-----------");
                console.log(trip_original_price);
                var seat_id_list = [];
                var seat_no_list = [];
                var new_seat_no_list = [];
                var seat_list_for_history = [];
                var front_price = 0;
                var front_id;
                var front_seat_update;
                var front_seat_filter;
                var seat_update;
                var new_trip_update;
                var trip_update;
                var ref_id = "ref_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                const seat_history_id = "seat_history_id_" + (0, uuid_1.v4)();
                var seatHistoryData;
                var trip_total_price = 0;
                for (var i = 0; i < SeatManager.seat_id.length; i++) {
                    if (SeatManager.seat_id[i]['seat_id'] == "") {
                        new_seat_no_list.push(SeatManager.seat_id[i]['seat_no']);
                    }
                    else {
                        seat_no_list.push(SeatManager.seat_id[i]['seat_no']);
                        seat_id_list.push(SeatManager.seat_id[i]['seat_id']);
                    }
                    seat_list_for_history.push(SeatManager.seat_id[i]['seat_no']);
                    if (SeatManager.seat_id[i]['seat_no'] == "1") {
                        front_seat_filter = { trip_id: SeatManager.trip_id, seat_id: SeatManager.seat_id[i]['seat_id'], seat_isdeleted: false };
                        front_id = SeatManager.seat_id[i];
                        front_seat_update = {
                            trip_id: SeatManager.trip_id,
                            sub_route_id: SeatManager.sub_route_id,
                            seat_status: SeatManager.seat_status,
                            total_price: SeatManager.front_seat_price,
                            customer_name: SeatManager.customer_name,
                            discount: SeatManager.discount,
                            phone: SeatManager.phone,
                            gender: SeatManager.gender,
                            pickup_place: SeatManager.pickup_place,
                            remark: SeatManager.remark,
                            userid: SeatManager.userid,
                            seat_isdeleted: SeatManager.seat_isdeleted,
                            ref_id: ref_id
                        };
                        trip_update = {
                            seat_and_status: JSON.stringify(SeatManager.seat_and_status),
                            total_price: trip_original_price + (SeatManager.front_seat_price - SeatManager.discount) + ((SeatManager.seat_id.length - 1) * (SeatManager.back_seat_price - SeatManager.discount))
                        };
                    }
                }
                seatHistoryData = {
                    seat_history_id: seat_history_id,
                    trip_id: SeatManager.trip_id,
                    userid: SeatManager.userid,
                    total_price: SeatManager.back_seat_price,
                    seat_no_array: JSON.stringify(seat_list_for_history),
                    seat_status: SeatManager.seat_status,
                    date_time: SeatManager.date_time,
                    seat_id: SeatManager.trip_id + JSON.stringify(SeatManager.seat_no_array),
                };
                // no new seat in the edit
                if (new_seat_no_list.length == 0) {
                    var result;
                    var seat_filter = {
                        trip_id: SeatManager.trip_id,
                        seat_id: { [Op.or]: seat_id_list },
                        seat_isdeleted: false
                    };
                    seat_update = {
                        trip_id: SeatManager.trip_id,
                        sub_route_id: SeatManager.sub_route_id,
                        seat_status: SeatManager.seat_status,
                        total_price: 0,
                        customer_name: SeatManager.customer_name,
                        discount: SeatManager.discount,
                        phone: SeatManager.phone,
                        gender: SeatManager.gender,
                        pickup_place: SeatManager.pickup_place,
                        remark: SeatManager.remark,
                        userid: SeatManager.userid,
                        seat_isdeleted: SeatManager.seat_isdeleted,
                        ref_id: ref_id
                    };
                    trip_update = {
                        seat_and_status: JSON.stringify(SeatManager.seat_and_status),
                        total_price: trip_original_price + (SeatManager.seat_id.length * (SeatManager.back_seat_price - SeatManager.discount))
                    };
                    var trip_filter = { trip_id: SeatManager.trip_id };
                    // 2-blocked and 3-booked
                    if (SeatManager.seat_status == 2 || SeatManager.seat_status == 3) {
                        trip_update = {
                            seat_and_status: JSON.stringify(SeatManager.seat_and_status),
                            total_price: trip_original_price - SeatManager.total_price
                        };
                        var [seat_edit, seat_and_status_update, seat_history_create] = yield Promise
                            .all([
                            this.seatModel.services.update(seat_update, { where: seat_filter }),
                            this.tripModel.services.update(trip_update, { where: trip_filter }),
                            this.seatHistoryModel.services.create(seatHistoryData)
                        ]);
                        if (seat_edit.length > 0 && seat_and_status_update.length > 0 && seat_history_create) {
                            result = { returncode: "200", message: 'Seat Updated successfully', data: {} };
                        }
                        else {
                            result = { returncode: "300", message: 'Error Upading Seat', data: {} };
                        }
                    }
                    // 1-open
                    else if (SeatManager.seat_status == 1) {
                        if (SeatManager.car_type == "1" && (seat_no_list.includes(5) || seat_no_list.includes(6) || seat_no_list.includes(7))) {
                            console.log("နောက်ဖုံးကိစ္စများ−−−−−−");
                        }
                        // book, blocked, sold ကို open ပြန်ပြောင်းတာ
                        else {
                            new_trip_update = {
                                seat_and_status: JSON.stringify(SeatManager.seat_and_status),
                                total_price: trip_original_price - (SeatManager.total_price)
                            };
                            console.log(">>>>>>> HERE >>>>>");
                            console.log(new_trip_update);
                            var [seat_delete, seat_and_status_update, seat_history_create] = yield Promise
                                .all([
                                this.seatModel.services.destroy({ where: seat_filter }),
                                this.tripModel.services.update(new_trip_update, { where: trip_filter }),
                                this.seatHistoryModel.services.create(seatHistoryData)
                            ]);
                            if (seat_and_status_update.length > 0 && seat_history_create) {
                                result = { returncode: "200", message: 'Seat Updated successfully', data: {} };
                            }
                            else {
                                result = { returncode: "300", message: 'Error Upading Seat', data: {} };
                            }
                        }
                    }
                    // 4-sold
                    else if (SeatManager.seat_status == 4) {
                        seat_update = Object.assign(Object.assign({}, seat_update), { total_price: SeatManager.back_seat_price });
                        if (seat_no_list.includes("1")) {
                            console.log(">>>>>");
                            console.log(front_seat_update);
                            console.log(front_seat_filter);
                            trip_update = {
                                seat_and_status: JSON.stringify(SeatManager.seat_and_status),
                                total_price: trip_original_price + ((SeatManager.seat_id.length - 1) * (SeatManager.back_seat_price - SeatManager.discount)) + SeatManager.front_seat_price - SeatManager.discount
                            };
                            var [seat_edit, seat_and_status_update, front_seat_edit, seat_history_create] = yield Promise
                                .all([
                                this.seatModel.services.update(seat_update, { where: seat_filter }),
                                this.tripModel.services.update(trip_update, { where: trip_filter }),
                                this.seatModel.services.update(front_seat_update, { where: front_seat_filter }),
                                this.seatHistoryModel.services.create(seatHistoryData)
                            ]);
                            if (seat_edit.length > 0 && seat_and_status_update.length > 0 && front_seat_edit.length > 0 && seat_history_create) {
                                result = { returncode: "200", message: 'Seat Updated successfully', data: {} };
                            }
                            else {
                                result = { returncode: "300", message: 'Error Upading Seat', data: {} };
                            }
                        }
                        else {
                            var [seat_edit, seat_and_status_update, seat_history_create] = yield Promise
                                .all([
                                this.seatModel.services.update(seat_update, { where: seat_filter }),
                                this.tripModel.services.update(trip_update, { where: trip_filter }),
                                this.seatHistoryModel.services.create(seatHistoryData)
                            ]);
                            if (seat_edit.length > 0 && seat_and_status_update.length > 0 && seat_history_create) {
                                result = { returncode: "200", message: 'Seat Updated successfully', data: {} };
                            }
                            else {
                                result = { returncode: "300", message: 'Error Upading Seat', data: {} };
                            }
                        }
                    }
                    return result;
                }
                else {
                    var result;
                    var seat_filter = { trip_id: SeatManager.trip_id, seat_id: { [Op.or]: seat_id_list }, seat_isdeleted: false };
                    seat_update = {
                        trip_id: SeatManager.trip_id,
                        sub_route_id: SeatManager.sub_route_id,
                        seat_status: SeatManager.seat_status,
                        total_price: SeatManager.back_seat_price,
                        customer_name: SeatManager.customer_name,
                        discount: SeatManager.discount,
                        phone: SeatManager.phone,
                        gender: SeatManager.gender,
                        pickup_place: SeatManager.pickup_place,
                        remark: SeatManager.remark,
                        userid: SeatManager.userid,
                        seat_isdeleted: SeatManager.seat_isdeleted,
                        ref_id: ref_id
                    };
                    var trip_total_price = (SeatManager.seat_id.length * (SeatManager.back_seat_price - SeatManager.discount));
                    trip_update = {
                        seat_and_status: JSON.stringify(SeatManager.seat_and_status),
                        total_price: trip_original_price + trip_total_price
                    };
                    var trip_filter = { trip_id: SeatManager.trip_id };
                    // 2-blocked and 3-booked
                    if (SeatManager.seat_status == 2 || SeatManager.seat_status == 3 && seat_history_create) {
                        seat_update = Object.assign(Object.assign({}, seat_update), { total_price: 0 });
                        trip_update = Object.assign(Object.assign({}, trip_update), { total_price: trip_original_price - SeatManager.total_price });
                        var [seat_edit, seat_and_status_update] = yield Promise
                            .all([
                            this.seatModel.services.update(seat_update, { where: seat_filter }),
                            this.tripModel.services.update(trip_update, { where: trip_filter }),
                            this.seatHistoryModel.services.create(seatHistoryData)
                        ]);
                        if (seat_edit.length > 0 && seat_and_status_update.length > 0 && seat_history_create) {
                            result = true;
                            console.log(result);
                        }
                        else {
                            result = false;
                            console.log(result);
                        }
                    }
                    // 1-open
                    else if (SeatManager.seat_status == 1) {
                        new_trip_update = {
                            seat_and_status: JSON.stringify(SeatManager.seat_and_status),
                            total_price: trip_original_price - SeatManager.total_price
                        };
                        // for back of the back which is called nout-phone
                        if (SeatManager.car_type == "1" && (seat_no_list.includes("5") || seat_no_list.includes("6") || seat_no_list.includes("7"))) {
                            console.log("နောက်ဖုံးကိစ္စများ−−−−−−");
                            new_trip_update = {
                                seat_and_status: JSON.stringify(SeatManager.seat_and_status),
                                total_price: trip_original_price - SeatManager.total_price
                            };
                            var [seat_and_status_update, seat_history_create] = yield Promise
                                .all([
                                this.tripModel.services.update(new_trip_update, { where: trip_filter }),
                                this.seatHistoryModel.services.create(seatHistoryData)
                            ]);
                            if (seat_and_status_update.length > 0) {
                                result = true;
                            }
                            else {
                                result = false;
                            }
                        }
                        // book, blocked, sold ကို open ပြန်ပြောင်းတာ
                        else {
                            console.log("<<<<<<<<<");
                            new_trip_update = {
                                seat_and_status: JSON.stringify(SeatManager.seat_and_status),
                                total_price: trip_original_price - (SeatManager.total_price)
                            };
                            console.log(new_trip_update);
                            var [seat_delete, seat_and_status_update, seat_history_create] = yield Promise
                                .all([
                                this.seatModel.services.destroy({ where: seat_filter }),
                                this.tripModel.services.update(new_trip_update, { where: trip_filter }),
                                this.seatHistoryModel.services.create(seatHistoryData)
                            ]);
                            console.log(seat_delete);
                            console.log(seat_and_status_update.length);
                            if (seat_delete > 0 && seat_and_status_update.length > 0) {
                                result = true;
                            }
                            else {
                                result = false;
                            }
                        }
                    }
                    // 4-sold
                    else if (SeatManager.seat_status == 4) {
                        if (seat_no_list.includes("1")) {
                            trip_update = {
                                seat_and_status: JSON.stringify(SeatManager.seat_and_status),
                                total_price: trip_original_price + (SeatManager.front_seat_price - SeatManager.discount) + ((SeatManager.seat_id.length - 1) * (SeatManager.back_seat_price - SeatManager.discount))
                                // total_price: trip_total_price + SeatManager.front_seat_price
                            };
                            var [seat_edit, seat_and_status_update] = yield Promise
                                .all([
                                this.seatModel.services.update(seat_update, { where: seat_filter }),
                                this.tripModel.services.update(trip_update, { where: trip_filter }),
                                this.seatModel.services.update(front_seat_update, { where: front_seat_filter }),
                                this.seatHistoryModel.services.create(seatHistoryData)
                            ]);
                            if (seat_edit.length > 0 && seat_and_status_update.length > 0) {
                                result = true;
                            }
                            else {
                                result = false;
                            }
                        }
                        else {
                            var [seat_edit, seat_and_status_update] = yield Promise
                                .all([
                                this.seatModel.services.update(seat_update, { where: seat_filter }),
                                this.tripModel.services.update(trip_update, { where: trip_filter }),
                                this.seatHistoryModel.services.create(seatHistoryData)
                            ]);
                            if (seat_edit.length > 0 && seat_and_status_update.length > 0) {
                                result = true;
                            }
                            else {
                                result = false;
                            }
                        }
                    }
                    try {
                        console.log("What is this? <-----------------------");
                        var seat_list = [];
                        var backSeatList = [];
                        var trip_total_price = 0;
                        var seat_total_price = 0;
                        for (let i = 0; i < new_seat_no_list.length; i++) {
                            const seat_id = "seat_id_" + (0, uuid_1.v4)();
                            var seatData;
                            if (new_seat_no_list[i] == "1") {
                                seatData = Object.assign(Object.assign({}, SeatManager), { total_price: SeatManager.front_seat_price, seat_id: seat_id, seat_no_array: new_seat_no_list[i], ref_id: ref_id });
                            }
                            else {
                                seat_total_price = SeatManager.back_seat_price;
                                seatData = Object.assign(Object.assign({}, SeatManager), { seat_id: seat_id, seat_no_array: new_seat_no_list[i], ref_id: ref_id });
                            }
                            seat_list.push(seatData);
                            trip_total_price = trip_total_price + seat_total_price;
                        }
                        trip_total_price = trip_total_price + trip_original_price;
                        var update;
                        // buy
                        if (SeatManager.seat_status == 4) {
                            update = {
                                seat_and_status: JSON.stringify(SeatManager.seat_and_status),
                                total_price: trip_total_price - (SeatManager.discount * SeatManager.seat_no_array.length)
                            };
                        }
                        else {
                            update = {
                                seat_and_status: JSON.stringify(SeatManager.seat_and_status)
                            };
                        }
                        var filter = { trip_id: SeatManager.trip_id };
                        var [seat_create, my_trip_update] = yield Promise
                            .all([
                            this.seatModel.services.bulkCreate(seat_list),
                            // this.seatModel.services.update(backSeatList, { where: filter }),
                            this.tripModel.services.update(update, { where: filter }),
                            this.seatHistoryModel.services.create(seatHistoryData)
                        ]);
                        console.log("What is this? <-----------------------");
                        if (result == true && seat_create.length > 0 && my_trip_update.length > 0) {
                            console.log("What is this? <-----------------------");
                            return { returncode: "200", message: "Success", data: {} };
                        }
                        else {
                            return { returncode: "300", message: "Fail", data: {} };
                        }
                    }
                    catch (e) {
                        console.log(e);
                        return { returncode: "300", message: "Fail", data: {} };
                    }
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
    __param(0, (0, typedi_1.Inject)('seatModel')),
    __param(1, (0, typedi_1.Inject)('tripModel')),
    __param(2, (0, typedi_1.Inject)('userModel')),
    __param(3, (0, typedi_1.Inject)('seatHistoryModel')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CategoryService);
exports.default = CategoryService;
