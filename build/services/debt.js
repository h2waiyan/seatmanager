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
let DebtService = class DebtService {
    constructor(debt_listModel, userModel) {
        this.debt_listModel = debt_listModel;
        this.userModel = userModel;
    }
    // user create -> userid, debt_id, debt_type, debt_name, debt_remark
    CreateDebt(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.adminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "Admin Not Found" };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create debt." };
            }
            try {
                var add_date = Date.now();
                console.log(add_date);
                // var now_time = new Date().toISOString();
                var now_time = new Date().toLocaleString("en-US", { timeZone: "Asia/Yangon" });
                console.log(now_time);
                const debt_list_id = "debt_list_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                const debtData = {
                    debt_list_id,
                    "debt_type": req.body.debt_type,
                    "amount": req.body.amount,
                    "name": req.body.name,
                    "add_date": now_time,
                    "due_date": req.body.due_date,
                    "remark": req.body.remark || ""
                };
                var dataCheck;
                yield this.debt_listModel.services.findAll({
                    where: { debt_list_id: debt_list_id, debt_isdeleted: false }
                }).then((data) => {
                    if (data.length > 0) {
                        dataCheck = data[0];
                    }
                });
                if (dataCheck) {
                    const returncode = "300";
                    const message = "Debt ID already exists. Try agian.";
                    return { returncode, message };
                }
                var newRecord;
                yield this.debt_listModel.services.create(debtData).then((data) => {
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
    //to get debt list -> userid, 
    GetDebtList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.adminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "Admin Not Found", data: {} };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create debt.", data: {} };
            }
            const Op = sequelize_1.default.Op;
            var to_get = 0;
            var to_give = 0;
            var to_get_list = [];
            var to_give_list = [];
            try {
                try {
                    var result;
                    // Mysql function to delete data
                    yield this.debt_listModel.services.findAll({ where: { debt_isdeleted: false } }).then((data) => {
                        if (data) {
                            const returncode = "200";
                            const message = "Debt List";
                            var templist = [];
                            data.map((item) => {
                                var tempitem = {
                                    debt_list_id: item.debt_list_id,
                                    debt_type: item.debt_type,
                                    amount: item.amount,
                                    name: item.name,
                                    // add_date: item.add_date,
                                    add_date: moment(item.add_date).format('hh:mm A, DD-MM-YYYY'),
                                    due_date: item.due_date,
                                    phone: item.phone,
                                    remark: item.remark,
                                    debt_isdeleted: item.debt_isdeleted,
                                };
                                if (item.debt_type == 1) {
                                    to_get += item.amount;
                                    to_get_list.push(tempitem);
                                }
                                if (item.debt_type == 2) {
                                    to_give += item.amount;
                                    to_give_list.push(tempitem);
                                }
                            });
                            data = templist;
                            // return { returncode, message, data };
                            result = {
                                returncode,
                                message, data: {
                                    to_get: { to_get_total: to_get, to_get_list },
                                    to_give: { to_give_total: to_give, to_give_list }
                                }
                            };
                        }
                        else {
                            const returncode = "300";
                            const message = "Debt list not found";
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
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
    EditDebt(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.adminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "User Not Found" };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create debt." };
            }
            const Op = sequelize_1.default.Op;
            try {
                var add_date = Date.now();
                console.log(add_date);
                // var now_time = new Date().toISOString();
                var now_time = new Date().toLocaleString("en-US", { timeZone: "Asia/Yangon" });
                var result;
                var filter = { debt_list_id: req.body.debt_list_id, debt_isdeleted: false };
                var update = {
                    debt_type: req.body.debt_type,
                    amount: req.body.amount,
                    name: req.body.name,
                    add_date: now_time,
                    due_date: req.body.due_date,
                    phone: req.body.phone,
                    remark: req.body.remark,
                    debt_isdeleted: req.body.debt_isdeleted,
                };
                yield this.debt_listModel.services
                    .update(update, {
                    where: filter,
                }).then((data) => {
                    if (data) {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Debt Lit Updated successfully' };
                        }
                        else {
                            result = { returncode: "300", message: 'Error upading or deleting debt' };
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
DebtService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('debt_listModel')),
    __param(1, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object, Object])
], DebtService);
exports.default = DebtService;
