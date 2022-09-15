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
var moment = require('moment-timezone');
let BuySellCarsService = class BuySellCarsService {
    constructor(buy_sell_carsModel, userModel) {
        this.buy_sell_carsModel = buy_sell_carsModel;
        this.userModel = userModel;
    }
    // user create -> userid, buy_sell_cars_id, buy_sell_type, car_type, car_no, amount, remark
    CreateBuySellCars(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.adminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "Admin Not Found" };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create Buy or Sell." };
            }
            try {
                var add_date = Date.now();
                console.log(add_date);
                // var now_time = new Date().toISOString();
                var now_time = new Date().toLocaleString("en-US", { timeZone: "Asia/Yangon" });
                console.log(now_time);
                const buy_sell_cars_id = "buy_sell_cars_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                const carData = Object.assign({ buy_sell_cars_id, "add_date": now_time }, req.body);
                var dataCheck;
                yield this.buy_sell_carsModel.services.findAll({
                    where: { buy_sell_cars_id: buy_sell_cars_id, buy_sell_cars_isdeleted: false }
                }).then((data) => {
                    if (data.length > 0) {
                        dataCheck = data[0];
                    }
                });
                if (dataCheck) {
                    const returncode = "300";
                    const message = "Buy Sell Cars ID already exists. Try agian.";
                    return { returncode, message };
                }
                var newRecord;
                yield this.buy_sell_carsModel.services.create(carData).then((data) => {
                    newRecord = data;
                });
                return { returncode: "200", message: "success" };
            }
            catch (e) {
                console.log(e);
                return { returncode: "300", message: "fail" };
            }
        });
    }
    //to get buy sell cars list -> userid, 
    GetBuySellCarsList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.adminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "Admin Not Found", data: {} };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create buy or sell.", data: {} };
            }
            const Op = sequelize_1.default.Op;
            var buy = 0;
            var sell = 0;
            var buy_list = [];
            var sell_list = [];
            try {
                var result;
                // Mysql function to delete data
                yield this.buy_sell_carsModel.services.findAll({ where: { buy_sell_cars_isdeleted: false } }).then((data) => {
                    if (data) {
                        const returncode = "200";
                        const message = "Buy/Sell Cars List";
                        var templist = [];
                        data.map((item) => {
                            var tempitem = {
                                buy_sell_cars_id: item.buy_sell_cars_id,
                                buy_sell_type: item.buy_sell_type,
                                car_no: item.car_no,
                                car_type: item.car_type,
                                amount: item.amount,
                                // add_date: item.add_date,
                                add_date: moment(item.add_date).format('hh:mm A, DD-MM-YYYY'),
                                remark: item.remark,
                                buy_sell_cars_isdeleted: item.buy_sell_cars_isdeleted,
                            };
                            if (item.buy_sell_type == 1) {
                                buy += item.amount;
                                buy_list.push(tempitem);
                            }
                            if (item.buy_sell_type == 2) {
                                sell += item.amount;
                                sell_list.push(tempitem);
                            }
                        });
                        data = templist;
                        // return { returncode, message, data };
                        result = {
                            returncode,
                            message, data: {
                                buy: { buy_total: buy, buy_list: buy_list },
                                sell: { sell_total: sell, sell_list: sell_list }
                            }
                        };
                    }
                    else {
                        const returncode = "300";
                        const message = "Car Buy Sell list not found";
                        var data;
                        result = { returncode, message, data };
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
    EditBuySellCars(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.adminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "User Not Found" };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create Buy/Sell Cars." };
            }
            const Op = sequelize_1.default.Op;
            try {
                var add_date = Date.now();
                console.log(add_date);
                // var now_time = new Date().toISOString();
                var now_time = new Date().toLocaleString("en-US", { timeZone: "Asia/Yangon" });
                console.log("......>>>>>>>>");
                console.log(now_time);
                var result;
                var filter = { buy_sell_cars_id: req.body.buy_sell_cars_id, buy_sell_cars_isdeleted: false };
                var update = {
                    buy_sell_cars_id: req.body.buy_sell_cars_id,
                    buy_sell_type: req.body.buy_sell_type,
                    car_no: req.body.car_no,
                    car_type: req.body.car_type,
                    amount: req.body.amount,
                    add_date: now_time,
                    remark: req.body.remark,
                    buy_sell_cars_isdeleted: req.body.buy_sell_cars_isdeleted,
                };
                yield this.buy_sell_carsModel.services
                    .update(update, {
                    where: filter,
                }).then((data) => {
                    if (data) {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Buy Sell cars List Updated successfully' };
                        }
                        else {
                            result = { returncode: "300", message: 'Error upading or deleting Buy Sell cars List' };
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
BuySellCarsService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('buy_sell_carsModel')),
    __param(1, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object, Object])
], BuySellCarsService);
exports.default = BuySellCarsService;
