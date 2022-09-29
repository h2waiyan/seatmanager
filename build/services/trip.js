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
const sequelize_1 = __importDefault(require("sequelize"));
const authorization_check_1 = __importDefault(require("./authorization_check"));
const typedi_2 = require("typedi");
const uuid_1 = require("uuid");
let TripService = class TripService {
    constructor(tripModel, userModel) {
        this.tripModel = tripModel;
        this.userModel = userModel;
    }
    CreateTrip(TripInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.rootAdminCheck(TripInterface.userid);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "Admin Not Found" };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create Category." };
            }
            try {
                var create_trip_list = [];
                for (let date_index = 0; date_index < TripInterface.date.length; date_index++) {
                    for (let route_index = 0; route_index < TripInterface.route_id.length; route_index++) {
                        for (let car_type_index = 0; car_type_index < TripInterface.car_type_id.length; car_type_index++) {
                            const trip_id = "trip_id_" + (0, uuid_1.v4)();
                            const trip_data = {
                                trip_id: trip_id,
                                userid: TripInterface.userid,
                                gate_id: TripInterface.gate_id,
                                date: TripInterface.date[date_index],
                                route_id: TripInterface.route_id[route_index],
                                car_type_id: TripInterface.car_type_id[car_type_index],
                                car_id: TripInterface.car_id,
                                total_price: TripInterface.total_price,
                                remark: TripInterface.remark,
                                trip_isdeleted: TripInterface.trip_isdeleted,
                            };
                            create_trip_list.push(trip_data);
                        }
                    }
                }
                console.log(">>>>>>");
                console.log(create_trip_list);
                var dataCheck;
                var newRecord;
                yield this.tripModel.services.bulkCreate(create_trip_list).then((data) => {
                    newRecord = data;
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
    GetTrips(GetTripInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            const Op = sequelize_1.default.Op;
            try {
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: GetTripInterface.userid } }).then((data) => {
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
                    yield this.tripModel.services.findAll({
                        where: { gate_id: GetTripInterface.gate_id,
                            date: GetTripInterface.date,
                            route_id: GetTripInterface.route_id
                        }
                    }).then((data) => {
                        if (data.length > 0) {
                            const returncode = "200";
                            const message = "Trip List";
                            result = { returncode, message, data: data };
                        }
                        else {
                            const returncode = "300";
                            const message = "Trip List Not Found";
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
    editTrip(TripInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.rootAdminCheck(TripInterface.userid);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "User Not Found", data: {} };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create Category.", data: {} };
            }
            const Op = sequelize_1.default.Op;
            try {
                if (TripInterface.trip_id == "" || TripInterface.trip_id == null) {
                    result = { returncode: "300", message: 'Trip ID cannot be blank', data: {} };
                    return result;
                }
                var result;
                var filter = { trip_id: TripInterface.trip_id, trip_isdeleted: false };
                var update = Object.assign(Object.assign({}, TripInterface), { trip_isdeleted: TripInterface.trip_isdeleted });
                yield this.tripModel.services
                    .update(update, {
                    where: filter,
                }).then((data) => {
                    if (data) {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Single Trip Updated successfully', data: {} };
                        }
                        else {
                            result = { returncode: "300", message: 'Error upading or deleting single trip', data: {} };
                        }
                    }
                });
                return result;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
};
TripService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('tripModel')),
    __param(1, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object, Object])
], TripService);
exports.default = TripService;
