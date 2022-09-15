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
const sequelize_2 = __importDefault(require("../sequelize"));
var moment = require('moment-timezone');
let add_cashService = class add_cashService {
    constructor(add_cashModel, userModel) {
        this.add_cashModel = add_cashModel;
        this.userModel = userModel;
    }
    // user create -> userid, add_cash_id, add_cash_type, add_cash_name, add_cash_cash_remark
    Createadd_cash(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.userCheck(req);
            if (userRecord == "user-not-found") {
                return { returncode: "300", message: "Admin Not Found" };
            }
            try {
                var add_date = Date.now();
                console.log(add_date);
                // var now_time = new Date().toISOString();
                var now_time = new Date().toLocaleString("en-US", { timeZone: "Asia/Yangon" });
                console.log(now_time);
                const add_cash_id = "add_cash_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                const add_cashData = Object.assign({ add_cash_id: add_cash_id, add_date: now_time }, req.body);
                var dataCheck;
                yield this.add_cashModel.services.findAll({
                    where: { add_cash_id: add_cash_id, add_cash_isdeleted: false }
                }).then((data) => {
                    if (data.length > 0) {
                        dataCheck = data[0];
                    }
                });
                if (dataCheck) {
                    const returncode = "300";
                    const message = "add_cash ID already exists. Try agian.";
                    return { returncode, message };
                }
                var newRecord;
                yield this.add_cashModel.services.create(add_cashData).then((data) => {
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
    //to get add_cash list -> userid, 
    GetAddCashList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var result;
            try {
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: req.body.userid } }).then((data) => {
                    if (data.length > 0) {
                        userRecord = data[0];
                    }
                });
            }
            catch (e) {
                console.log(e);
                throw e;
            }
            if (!userRecord) {
                const returncode = "300";
                const message = "User Not Registered";
                var data;
                return { returncode, message, data };
            }
            if (userRecord.usertype == 3) {
                try {
                    var startDateofMonth = moment().startOf('month').format('YYYY-MM-DD');
                    var lastDateofMonth = moment().endOf('month').format('YYYY-MM-DD');
                    console.log("first day of month -> " + startDateofMonth + " last day of month is -> " + lastDateofMonth);
                }
                catch (_a) {
                    return { returncode: "300", message: "Error Getting This Month", data: {} };
                }
                var montlyQuery = `SELECT * FROM add_cashes 
                JOIN users ON add_cashes.userid = users.userid
                where add_cashes.add_cash_isdeleted = 'false' and add_cashes.userid = '${req.body.userid}' and
                add_cashes.add_date BETWEEN '${startDateofMonth}' AND '${lastDateofMonth}';`;
                try {
                    var userdata;
                    yield sequelize_2.default.query(montlyQuery).then((data) => {
                        if (data[0] == null) {
                            userdata = [];
                        }
                        else {
                            console.log(data[0]);
                            userdata = data[0];
                        }
                    });
                    var templist = [];
                    userdata.map((item) => {
                        var tempitem = {
                            add_cash_id: item.add_cash_id,
                            cash_type: item.cash_type,
                            name: item.name,
                            amount: item.amount,
                            from_date: item.from_date,
                            to_date: item.to_date,
                            add_date: moment(item.add_date).format('hh:mm A, DD-MM-YYYY'),
                            cash_remark: item.cash_remark,
                            username: item.username,
                        };
                        templist.push(tempitem);
                    });
                    var mydata = templist;
                    result = {
                        returncode: "200",
                        message: "add_cash_list",
                        data: mydata
                    };
                }
                catch (e) {
                    console.log(e);
                    result = { returncode: "300", message: "Error", data: {} };
                    throw e;
                }
                return result;
            }
            else {
                var admindata;
                var adminCashListQuery = `SELECT * FROM add_cashes 
            JOIN users ON add_cashes.userid = users.userid
            where add_cashes.add_cash_isdeleted = 'false';`;
                yield sequelize_2.default.query(adminCashListQuery).then((data) => {
                    if (data[0] == null) {
                        admindata = [];
                        const returncode = "300";
                        const message = "Car Buy Sell list not found";
                        var data;
                        result = { returncode, message, data };
                    }
                    else {
                        console.log(data[0]);
                        admindata = data[0];
                        var templist = [];
                        data[0].map((item) => {
                            var tempitem = {
                                add_cash_id: item.add_cash_id,
                                cash_type: item.cash_type,
                                amount: item.amount,
                                from_date: item.from_date,
                                to_date: item.to_date,
                                // add_date: item.add_date,
                                add_date: moment(item.add_date).format('hh:mm A, DD-MM-YYYY'),
                                cash_remark: item.cash_remark,
                                add_cash_isdeleted: item.add_cash_isdeleted,
                                username: item.username,
                            };
                            templist.push(tempitem);
                            console.log(templist);
                        });
                        admindata = templist;
                        result = {
                            returncode: "200",
                            message: "Add Cash List",
                            data: admindata
                        };
                    }
                });
                return result;
            }
            return result;
        });
    }
    AddCashFilter(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.adminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "Admin Not Found", data: [] };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Has no authorization to get cash history list .", data: [] };
            }
            try {
                // getting start date and end date
                try {
                    var start_date = moment(new Date(req.body.start_date)).format('YYYY-MM-DD');
                    var end_date = moment(new Date(req.body.end_date)).format('YYYY-MM-DD');
                }
                catch (_a) {
                    return { returncode: "300", message: "Invalid Date", data: [] };
                }
                var filter = "(add_cashes.add_cash_isdeleted = 'false')";
                if (req.body.search_userid != "") {
                    filter += " and (add_cashes.userid = '" + req.body.search_userid + "')";
                }
                if (req.body.start_date != "") {
                    filter += " and (add_cashes.add_date BETWEEN '" + start_date + "' AND '" + end_date + "')";
                }
                if (req.body.cash_type != "") {
                    filter += " and (add_cashes.cash_type = '" + req.body.cash_type + "')";
                }
                var adminCashListQuery = `
          SELECT * FROM add_cashes
          JOIN users ON add_cashes.userid = users.userid
          where ${filter}
          ORDER BY add_cashes.add_date DESC;
          `;
                // creating date list from data with the requested date range
                try {
                    var templist = [];
                    yield sequelize_2.default.query(adminCashListQuery).then((data) => {
                        if (data) {
                            data[0].map((item) => {
                                var tempitem = {
                                    add_cash_id: item.add_cash_id,
                                    cash_type: item.cash_type,
                                    amount: item.amount,
                                    from_date: item.from_date,
                                    to_date: item.to_date,
                                    // add_date: item.add_date,
                                    add_date: moment(item.add_date).format('hh:mm A, DD-MM-YYYY'),
                                    cash_remark: item.cash_remark,
                                    add_cash_isdeleted: item.add_cash_isdeleted,
                                    username: item.username,
                                };
                                templist.push(tempitem);
                            });
                        }
                        else {
                            templist = [];
                        }
                        console.log(templist);
                    });
                    return { returncode: "200", message: "Cash History List", data: templist };
                }
                catch (_b) {
                    return { returncode: "300", message: "Error Getting List", data: [] };
                }
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
    EditAddCash(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.userCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "User Not Found" };
            }
            const Op = sequelize_1.default.Op;
            try {
                var add_date = Date.now();
                console.log(add_date);
                // var now_time = new Date().toISOString();
                var now_time = new Date().toLocaleString("en-US", { timeZone: "Asia/Yangon" });
                var result;
                var filter = {
                    add_cash_list_id: req.body.add_cash_list_id,
                    // userid : req.body.userid,
                    add_cash_isdeleted: false,
                };
                var update = {
                    add_cash_type: req.body.add_cash_type,
                    amount: req.body.amount,
                    name: req.body.name,
                    add_date: now_time,
                    from_date: req.body.from_date,
                    to_date: req.body.to_date,
                    cash_remark: req.body.cash_remark,
                    add_cash_isdeleted: req.body.add_cash_isdeleted,
                };
                yield this.add_cashModel.services
                    .update(update, {
                    where: filter,
                }).then((data) => {
                    if (data) {
                        if (data == 1) {
                            result = { returncode: "200", message: 'add_cash Lit Updated successfully' };
                        }
                        else {
                            result = { returncode: "300", message: 'Error upading or deleting add_cash' };
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
add_cashService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('add_cashModel')),
    __param(1, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object, Object])
], add_cashService);
exports.default = add_cashService;
