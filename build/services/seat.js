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
let CategoryService = class CategoryService {
    constructor(seatModel, userModel) {
        this.seatModel = seatModel;
        this.userModel = userModel;
    }
    // user create -> userid, category_id, category_type, category_name, category_remark
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
                const seat_id = "seat_id_" + (0, uuid_1.v4)();
                const seatData = Object.assign(Object.assign({}, SeatManager), { seat_id: seat_id });
                console.log(">>>>>>>");
                console.log(seatData);
                var dataCheck;
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
                var newRecord;
                yield this.seatModel.services.create(seatData).then((data) => {
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
    editCategory(SeatManager) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.rootAdminCheck(SeatManager.userid);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "User Not Found" };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create Category." };
            }
            const Op = sequelize_1.default.Op;
            try {
                var result;
                var filter = { category_id: SeatManager.seat_id, category_isdeleted: false };
                var update = {
                    category_isdeleted: SeatManager.seat_isdeleted
                };
                yield this.seatModel.services
                    .update(update, {
                    where: filter,
                }).then((data) => {
                    if (data) {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Category Updated successfully' };
                        }
                        else {
                            result = { returncode: "300", message: 'Error upading or deleting category' };
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
CategoryService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('seatModel')),
    __param(1, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object, Object])
], CategoryService);
exports.default = CategoryService;
