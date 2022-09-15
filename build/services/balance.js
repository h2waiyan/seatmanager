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
const authorization_check_1 = __importDefault(require("./authorization_check"));
const typedi_2 = require("typedi");
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize_2 = __importDefault(require("../sequelize"));
const moment_1 = __importDefault(require("moment"));
const send_noti_1 = __importDefault(require("./send_noti"));
let BalanceService = class BalanceService {
    constructor(userModel, balanceModel, car_historyModel, gate_historyModel) {
        this.userModel = userModel;
        this.balanceModel = balanceModel;
        this.car_historyModel = car_historyModel;
        this.gate_historyModel = gate_historyModel;
    }
    CreateBalance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.userCheck(req);
            if (userRecord == "user-not-found") {
                return { returncode: "300", message: "User Not Found" };
            }
            try {
                const balance_id = "balance_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                const balanceData = Object.assign({ balance_id }, req.body);
                var balancedataCheck;
                yield this.balanceModel.services.findAll({
                    where: { balance_id: balance_id, balance_isdeleted: false }
                }).then((data) => {
                    if (data.length > 0) {
                        balancedataCheck = data[0];
                    }
                });
                if (balancedataCheck) {
                    const returncode = "300";
                    const message = "Balance ID already exists. Try agian.";
                    return { returncode, message };
                }
                var newRecord;
                yield this.balanceModel.services.create(balanceData).then((data) => {
                    newRecord = data;
                });
                // if car income outcome type is for khout_kyay, we will add details
                if (req.body.car_inouttype == "2") {
                    const car_history_id = "car_history_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                    var car_balanceData = {
                        car_history_id,
                        balance_id,
                        go_trip: req.body.go_trip,
                        comeback_trip: req.body.comeback_trip,
                        petrol_price: req.body.petrol_price,
                        khout_kyay: req.body.khout_kyay,
                        road_services: req.body.road_services,
                        misc: req.body.misc,
                        total_amount: req.body.amount
                    };
                    var dataCheck;
                    yield this.car_historyModel.services.findAll({
                        where: { car_history_id: car_history_id, car_history_isdeleted: false }
                    }).then((data) => {
                        if (data.length > 0) {
                            dataCheck = data[0];
                        }
                    });
                    if (dataCheck) {
                        const returncode = "300";
                        const message = "Car Balance ID already exists. Try agian.";
                        return { returncode, message };
                    }
                    var newRecord;
                    yield this.car_historyModel.services.create(car_balanceData).then((data) => {
                        newRecord = data;
                    });
                    var sendNotiService = typedi_2.Container.get(send_noti_1.default);
                    var notisending = sendNotiService.FindNotiList();
                }
                if (req.body.car_inouttype == "3") {
                    req.body.gate_details.map((item) => __awaiter(this, void 0, void 0, function* () {
                        const gate_history_id = "gate_history_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                        var gate_history_data = {
                            gate_history_id: gate_history_id,
                            balance_id: balance_id,
                            car_no: item.car_no,
                            car_amount: item.car_amount,
                            trip_type: item.trip_type,
                        };
                        var dataCheck;
                        yield this.gate_historyModel.services.findAll({
                            where: { gate_history_id: gate_history_id, gate_history_isdeleted: false }
                        }).then((data) => {
                            if (data.length > 0) {
                                dataCheck = data[0];
                            }
                        });
                        if (dataCheck) {
                            const returncode = "300";
                            const message = "Gate Balance ID already exists. Try agian.";
                            return { returncode, message };
                        }
                        var newRecord;
                        yield this.gate_historyModel.services.create(gate_history_data).then((data) => {
                            newRecord = data;
                        });
                    }));
                }
                return { returncode: "200", message: "success" };
            }
            catch (e) {
                console.log(e);
                return { returncode: "300", message: "fail" };
            }
        });
    }
    EditBalance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var userRecord;
            yield this.userModel.services.findAll({ where: { userid: req.body.userid } }).then((data) => {
                if (data.length > 0) {
                    userRecord = data[0];
                }
            });
            if (!userRecord) {
                const returncode = "300";
                const message = "User Not Registered";
                var data;
                return { returncode, message };
            }
            const Op = sequelize_1.default.Op;
            if (userRecord.usertype == 3) {
                try {
                    var result;
                    var filter = { balance_id: req.body.balance_id, balance_isdeleted: false };
                    var update = {
                        balance_remark: req.body.balance_remark,
                    };
                    yield this.balanceModel.services
                        .update(update, {
                        where: filter,
                    }).then((data) => {
                        if (data) {
                            if (data == 1) {
                                result = { returncode: "200", message: 'Balance Updated successfully' };
                            }
                            else {
                                result = { returncode: "300", message: 'Error upading or deleting balance' };
                            }
                        }
                    });
                    return result;
                }
                catch (e) {
                    console.log(e);
                    throw e;
                }
            }
            else {
                try {
                    var result;
                    var filter = { balance_id: req.body.balance_id, balance_isdeleted: false };
                    var adminupdate = {
                        category_id: req.body.category_id,
                        balance_type: req.body.balance_type,
                        balance_name: req.body.balance_name,
                        keyword_id: req.body.keyword_id,
                        car_inouttype: req.body.car_inouttype,
                        amount: req.body.amount,
                        date: req.body.date,
                        balance_remark: req.body.balance_remark,
                        user_id: req.body.user_id,
                        is_private: req.body.is_private,
                        balance_isdeleted: req.body.balance_isdeleted
                    };
                    if (req.body.car_inouttype == "3") {
                        if (req.body.balance_isdeleted == 'true') {
                            yield this.gate_historyModel.services
                                .update({ gate_history_isdeleted: false }, {
                                where: {
                                    balance_id: req.body.balance_id,
                                    // gate_history_isdeleted: false
                                },
                            }).then((data) => {
                                console.log("Updated Successfully.");
                            });
                        }
                        req.body.gate_details.map((item) => __awaiter(this, void 0, void 0, function* () {
                            var gate_history_data;
                            var new_gate_history_data;
                            if (item.gate_history_id == '') {
                                const gate_history_id = "gate_history_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                                new_gate_history_data = {
                                    gate_history_id: gate_history_id,
                                    balance_id: req.body.balance_id,
                                    car_no: item.car_no,
                                    car_amount: item.car_amount,
                                    trip_type: item.trip_type,
                                    gate_history_isdeleted: false
                                };
                                yield this.gate_historyModel.services.create(new_gate_history_data).then((data) => {
                                    var gateNewRecord = data;
                                });
                            }
                            else {
                                gate_history_data = {
                                    balance_id: req.body.balance_id,
                                    car_no: item.car_no,
                                    car_amount: item.car_amount,
                                    trip_type: item.trip_type,
                                    gate_history_isdeleted: item.gate_history_isdeleted
                                };
                                yield this.gate_historyModel.services
                                    .update(gate_history_data, {
                                    where: {
                                        balance_id: req.body.balance_id,
                                        gate_history_id: item.gate_history_id,
                                        gate_history_isdeleted: false
                                    },
                                }).then((data) => {
                                    console.log("Updated Successfully.");
                                });
                                console.log(gate_history_data);
                            }
                        }));
                    }
                    yield this.balanceModel.services
                        .update(adminupdate, {
                        where: filter,
                    }).then((data) => {
                        if (data) {
                            if (data == 1) {
                                result = { returncode: "200", message: 'Balance Updated successfully' };
                            }
                            else {
                                console.log(data);
                                result = { returncode: "300", message: 'Error upading or deleting balance' };
                            }
                        }
                    });
                    return result;
                }
                catch (e) {
                    console.log(e);
                    throw e;
                }
            }
        });
    }
    GetTodayBalance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const Op = sequelize_1.default.Op;
            try {
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: req.body.userid } }).then((data) => {
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
                    var todayDate = new Date(req.body.date);
                    var today = (0, moment_1.default)(new Date(todayDate)).format('YYYY-MM-DD');
                }
                catch (_a) {
                    return { returncode: "300", message: "Invalid Date" };
                }
                var filter;
                var userid = req.body.userid;
                var searchQuery;
                if (userRecord.usertype == 1) {
                    searchQuery = `SELECT * FROM balances 
        JOIN categories ON balances.category_id = categories.category_id
        LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
        WHERE balances.balance_isdeleted = 'false' and balances.date = '${today}';`;
                }
                else if (userRecord.usertype == 2) {
                    searchQuery = `SELECT * FROM balances 
        JOIN categories ON balances.category_id = categories.category_id
        LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
        WHERE balances.is_private = 'false' and balances.balance_isdeleted = 'false' and balances.date = '${today}';`;
                }
                else {
                    searchQuery = `SELECT * FROM balances 
        JOIN categories ON balances.category_id = categories.category_id
        LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
        WHERE balances.is_private = 'false' and balances.balance_isdeleted = 'false' and 
        balances.date = '${today}' and balances.userid = '${userid}';`;
                }
                try {
                    var result;
                    var userid = req.body.userid;
                    var income = 0;
                    var outcome = 0;
                    var total = 0;
                    yield sequelize_2.default.query(searchQuery).then((data) => {
                        if (data) {
                            var templist = [];
                            data[0].map((item) => {
                                var tempitem = {
                                    balance_id: item.balance_id,
                                    balance_type: item.balance_type,
                                    balance_name: item.balance_name,
                                    amount: item.amount,
                                    category_name: item.category_name,
                                    category_icon: item.category_icon,
                                    category_type: item.category_type,
                                    keyword_name: item.keyword_name,
                                    date: item.date,
                                    formatted_date: (0, moment_1.default)(new Date(item.date)).format('MMMM DD, YYYY'),
                                    userid: item.userid,
                                    car_inouttype: item.car_inouttype,
                                    balance_remark: item.balance_remark,
                                };
                                if (item.balance_type == 1) {
                                    income += item.amount;
                                    console.log(">>>>>" + income);
                                }
                                if (item.balance_type == 2) {
                                    outcome += item.amount;
                                    console.log(">>>>>>" + outcome);
                                }
                                templist.push(tempitem);
                                total = income - outcome;
                            });
                            var todayData = templist;
                            const returncode = "200";
                            const message = "Today Balance";
                            result = {
                                returncode,
                                message,
                                todayBalance: total,
                                todayIncome: income,
                                todayOutcome: outcome,
                                data: todayData
                            };
                        }
                        else {
                            const returncode = "300";
                            const message = "Balance list not found";
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
    TotalDashboardBalance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: req.body.userid } }).then((data) => {
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
                // getting start date and end date
                try {
                    var curr = new Date(); // get current date
                    var first = curr.getDate() - curr.getDay();
                    var last = first + 6; // last day is the first day + 6
                    var today = (0, moment_1.default)(new Date(curr)).format('YYYY-MM-DD');
                    var startOfWeek = (0, moment_1.default)().startOf('isoWeek').toDate();
                    var endOfWeek = (0, moment_1.default)().endOf('isoWeek').toDate();
                    var startDateofWeek = (0, moment_1.default)(startOfWeek).format('YYYY-MM-DD');
                    var lastDateofWeek = (0, moment_1.default)(endOfWeek).format('YYYY-MM-DD');
                    var startDateofMonth = (0, moment_1.default)().startOf('month').format('YYYY-MM-DD');
                    var lastDateofMonth = (0, moment_1.default)().endOf('month').format('YYYY-MM-DD');
                    const currentYear = new Date().getFullYear();
                    const startoftheyear = new Date(currentYear, 0, 1);
                    var startDateofYear = (0, moment_1.default)(new Date(startoftheyear)).format('YYYY-MM-DD');
                    const lastoftheyear = new Date(currentYear, 11, 31);
                    var lastDateofYear = (0, moment_1.default)(new Date(lastoftheyear)).format('YYYY-MM-DD');
                    console.log("today is " + today);
                    console.log("first day of week -> " + startDateofWeek + " last day of week is -> " + lastDateofWeek);
                    console.log("first day of month -> " + startDateofMonth + " last day of month is -> " + lastDateofMonth);
                    console.log("first day of year -> " + startDateofYear + " last day of year is -> " + lastDateofYear);
                }
                catch (_a) {
                    return { returncode: "300", message: "Invalid Date", data: {} };
                }
                // creating date list from data with the requested date range
                // try {
                //   var dateList: any[] = [];
                //   await sequelize.query(`
                //   SELECT DISTINCT date FROM balances
                //   where balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'
                //   ORDER BY balances.date DESC
                //   `).then((data: any) => {
                //     if (data) {
                //       data[0].map((item: any) => {
                //         dateList.push(item.date);
                //       })
                //     }
                //   })
                //   console.log(dateList);
                // } catch {
                //   return { returncode: "300", message: "Error Getting Date List", data: {} };
                // }
                // createing search query according to user type
                var todayQuery = '';
                var todayincomeQuery = '';
                var todayoutcomeQuery = '';
                var weekincomeQuery = '';
                var weekoutcomeQuery = '';
                var monthincomeQuery = '';
                var monthoutcomeQuery = '';
                var yearincomeQuery = '';
                var yearoutcomeQuery = '';
                if (userRecord.usertype == 1) {
                    todayQuery = `SELECT * FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_isdeleted = 'false' and 
          balances.date = '${today}';`;
                    todayincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_isdeleted = 'false' and 
          balances.balance_type = '1' and 
          balances.date = '${today}';`;
                    todayoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_isdeleted = 'false' and 
          balances.balance_type = '2' and 
          balances.date = '${today}';`;
                    weekincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and 
          balances.balance_type = '1' and 
          balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'`;
                    weekoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and 
          balances.balance_type = '2' and 
          balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'`;
                    monthincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and 
          balances.balance_type = '1' and 
          balances.date BETWEEN '${startDateofMonth}' AND '${lastDateofMonth}'`;
                    monthoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and 
          balances.balance_type = '2' and 
          balances.date BETWEEN '${startDateofMonth}' AND '${lastDateofMonth}'`;
                    yearincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and 
          balances.balance_type = '1' and 
          balances.date BETWEEN '${startDateofYear}' AND '${lastDateofYear}'`;
                    yearoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and 
          balances.balance_type = '2' and 
          balances.date BETWEEN '${startDateofYear}' AND '${lastDateofYear}'`;
                }
                else if (userRecord.usertype == 2) {
                    todayQuery = `SELECT * FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and 
          balances.date = '${today}';`;
                    todayincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and 
          balances.balance_type = '1' and 
          balances.date = '${today}';`;
                    todayoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and 
          balances.balance_type = '2' and 
          balances.date = '${today}';`;
                    weekincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '1' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'`;
                    weekoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '2' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'`;
                    monthincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '1' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofMonth}' AND '${lastDateofMonth}'`;
                    monthoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '2' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofMonth}' AND '${lastDateofMonth}'`;
                    yearincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '1' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofYear}' AND '${lastDateofYear}'`;
                    yearoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '2' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofYear}' AND '${lastDateofYear}'`;
                }
                else {
                    return { returncode: "300", message: "User has no authorization to view history.", data: {} };
                }
                var todayincome;
                var todayoutcome;
                var todaytotal;
                var weekincome;
                var weekoutcome;
                var weektotal;
                var monthincome;
                var monthoutcome;
                var monthtotal;
                var yearincome;
                var yearoutcome;
                var yeartotal;
                try {
                    var result;
                    var dashboardData = [];
                    yield sequelize_2.default.query(todayincomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            todayincome = 0;
                        }
                        else {
                            todayincome = data[0][0].sum;
                        }
                    });
                    yield sequelize_2.default.query(todayoutcomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            todayoutcome = 0;
                        }
                        else {
                            todayoutcome = data[0][0].sum;
                        }
                    });
                    todaytotal = todayincome - todayoutcome;
                    dashboardData.push({ title: "Today Balance", total: todaytotal, income: todayincome, outcome: todayoutcome });
                    yield sequelize_2.default.query(weekincomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            weekincome = 0;
                        }
                        else {
                            weekincome = data[0][0].sum;
                        }
                    });
                    yield sequelize_2.default.query(weekoutcomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            weekoutcome = 0;
                        }
                        else {
                            weekoutcome = data[0][0].sum;
                        }
                    });
                    weektotal = weekincome - weekoutcome;
                    dashboardData.push({ title: "Weekly Balance", total: weektotal, income: weekincome, outcome: weekoutcome });
                    yield sequelize_2.default.query(monthincomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            monthincome = 0;
                        }
                        else {
                            monthincome = data[0][0].sum;
                        }
                    });
                    yield sequelize_2.default.query(monthoutcomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            monthoutcome = 0;
                        }
                        else {
                            monthoutcome = data[0][0].sum;
                        }
                    });
                    monthtotal = monthincome - monthoutcome;
                    dashboardData.push({ title: "Monthly Balance", total: monthtotal, income: monthincome, outcome: monthoutcome });
                    yield sequelize_2.default.query(yearincomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            yearincome = 0;
                        }
                        else {
                            yearincome = data[0][0].sum;
                        }
                    });
                    yield sequelize_2.default.query(yearoutcomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            yearoutcome = 0;
                        }
                        else {
                            yearoutcome = data[0][0].sum;
                        }
                    });
                    yeartotal = yearincome - yearoutcome;
                    dashboardData.push({ title: "Yearly Balance", total: yeartotal, income: yearincome, outcome: yearoutcome });
                    const returncode = "200";
                    const message = "Dashboard";
                    return { returncode, message, dashboardData: dashboardData };
                }
                catch (e) {
                    console.log(e);
                    return { returncode: 300, message: "Error in getting SUM", dashboardData: {} };
                    throw e;
                }
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
    CarDashboardBalance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: req.body.userid } }).then((data) => {
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
                // getting start date and end date
                try {
                    var curr = new Date(); // get current date
                    var first = curr.getDate() - curr.getDay();
                    var last = first + 6; // last day is the first day + 6
                    var today = (0, moment_1.default)(new Date(curr)).format('YYYY-MM-DD');
                    var startOfWeek = (0, moment_1.default)().startOf('isoWeek').toDate();
                    var endOfWeek = (0, moment_1.default)().endOf('isoWeek').toDate();
                    var startDateofWeek = (0, moment_1.default)(startOfWeek).format('YYYY-MM-DD');
                    var lastDateofWeek = (0, moment_1.default)(endOfWeek).format('YYYY-MM-DD');
                    var startDateofMonth = (0, moment_1.default)().startOf('month').format('YYYY-MM-DD');
                    var lastDateofMonth = (0, moment_1.default)().endOf('month').format('YYYY-MM-DD');
                    const currentYear = new Date().getFullYear();
                    const startoftheyear = new Date(currentYear, 0, 1);
                    var startDateofYear = (0, moment_1.default)(new Date(startoftheyear)).format('YYYY-MM-DD');
                    const lastoftheyear = new Date(currentYear, 11, 31);
                    var lastDateofYear = (0, moment_1.default)(new Date(lastoftheyear)).format('YYYY-MM-DD');
                    console.log("today is " + today);
                    console.log("first day of week -> " + startDateofWeek + " last day of week is -> " + lastDateofWeek);
                    console.log("first day of month -> " + startDateofMonth + " last day of month is -> " + lastDateofMonth);
                    console.log("first day of year -> " + startDateofYear + " last day of year is -> " + lastDateofYear);
                }
                catch (_a) {
                    return { returncode: "300", message: "Invalid Date", data: {} };
                }
                // creating date list from data with the requested date range
                // try {
                //   var dateList: any[] = [];
                //   await sequelize.query(`
                //   SELECT DISTINCT date FROM balances
                //   JOIN categories ON balances.category_id = categories.category_id
                //   where balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'
                //   ORDER BY balances.date DESC
                //   `).then((data: any) => {
                //     if (data) {
                //       data[0].map((item: any) => {
                //         if (item.category_type == 1 ) {
                //           dateList.push(item.date);
                //         }
                //       })
                //     }
                //   })
                //   console.log(dateList);
                // } catch {
                //   return { returncode: "300", message: "Error Getting Date List", data: {} };
                // }
                // createing search query according to user type
                var todayQuery = '';
                var todayincomeQuery = '';
                var todayoutcomeQuery = '';
                var weekincomeQuery = '';
                var weekoutcomeQuery = '';
                var monthincomeQuery = '';
                var monthoutcomeQuery = '';
                var yearincomeQuery = '';
                var yearoutcomeQuery = '';
                if (userRecord.usertype == 1) {
                    todayQuery = `SELECT * FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_isdeleted = 'false' and categories.category_type = '2' and 
          balances.date = '${today}';`;
                    todayincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_isdeleted = 'false' and categories.category_type = '2' and 
          balances.balance_type = '1' and 
          balances.date = '${today}';`;
                    todayoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_isdeleted = 'false' and categories.category_type = '2' and 
          balances.balance_type = '2' and 
          balances.date = '${today}';`;
                    weekincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and  categories.category_type = '2' and 
          balances.balance_type = '1' and 
          balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'`;
                    weekoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and  categories.category_type = '2' and 
          balances.balance_type = '2' and 
          balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'`;
                    monthincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and  categories.category_type = '2' and 
          balances.balance_type = '1' and 
          balances.date BETWEEN '${startDateofMonth}' AND '${lastDateofMonth}'`;
                    monthoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and  categories.category_type = '2' and 
          balances.balance_type = '2' and 
          balances.date BETWEEN '${startDateofMonth}' AND '${lastDateofMonth}'`;
                    yearincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and  categories.category_type = '2' and 
          balances.balance_type = '1' and 
          balances.date BETWEEN '${startDateofYear}' AND '${lastDateofYear}'`;
                    yearoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and  categories.category_type = '2' and 
          balances.balance_type = '2' and 
          balances.date BETWEEN '${startDateofYear}' AND '${lastDateofYear}'`;
                }
                else if (userRecord.usertype == 2) {
                    todayQuery = `SELECT * FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.is_private = 'false' and  categories.category_type = '2' and 
          balances.balance_isdeleted = 'false' and 
          balances.date = '${today}';`;
                    todayincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.is_private = 'false' and  categories.category_type = '2' and 
          balances.balance_isdeleted = 'false' and 
          balances.balance_type = '1' and 
          balances.date = '${today}';`;
                    todayoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.is_private = 'false' and  categories.category_type = '2' and 
          balances.balance_isdeleted = 'false' and 
          balances.balance_type = '2' and 
          balances.date = '${today}';`;
                    weekincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '1' and  categories.category_type = '2' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'`;
                    weekoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '2' and  categories.category_type = '2' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'`;
                    monthincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '1' and  categories.category_type = '2' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofMonth}' AND '${lastDateofMonth}'`;
                    monthoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '2' and  categories.category_type = '2' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofMonth}' AND '${lastDateofMonth}'`;
                    yearincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '1' and  categories.category_type = '2' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofYear}' AND '${lastDateofYear}'`;
                    yearoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '2' and  categories.category_type = '2' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofYear}' AND '${lastDateofYear}'`;
                }
                else {
                    return { returncode: "300", message: "User has no authorization to view history.", data: {} };
                }
                var todayincome;
                var todayoutcome;
                var todaytotal;
                var weekincome;
                var weekoutcome;
                var weektotal;
                var monthincome;
                var monthoutcome;
                var monthtotal;
                var yearincome;
                var yearoutcome;
                var yeartotal;
                try {
                    var result;
                    var dashboardData = [];
                    yield sequelize_2.default.query(todayincomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            todayincome = 0;
                        }
                        else {
                            todayincome = data[0][0].sum;
                        }
                    });
                    yield sequelize_2.default.query(todayoutcomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            todayoutcome = 0;
                        }
                        else {
                            todayoutcome = data[0][0].sum;
                        }
                    });
                    todaytotal = todayincome - todayoutcome;
                    dashboardData.push({ title: "Today Balance", total: todaytotal, income: todayincome, outcome: todayoutcome });
                    yield sequelize_2.default.query(weekincomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            weekincome = 0;
                        }
                        else {
                            weekincome = data[0][0].sum;
                        }
                    });
                    yield sequelize_2.default.query(weekoutcomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            weekoutcome = 0;
                        }
                        else {
                            weekoutcome = data[0][0].sum;
                        }
                    });
                    weektotal = weekincome - weekoutcome;
                    dashboardData.push({ title: "Weekly Balance", total: weektotal, income: weekincome, outcome: weekoutcome });
                    yield sequelize_2.default.query(monthincomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            monthincome = 0;
                        }
                        else {
                            monthincome = data[0][0].sum;
                        }
                    });
                    yield sequelize_2.default.query(monthoutcomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            monthoutcome = 0;
                        }
                        else {
                            monthoutcome = data[0][0].sum;
                        }
                    });
                    monthtotal = monthincome - monthoutcome;
                    dashboardData.push({ title: "Monthly Balance", total: monthtotal, income: monthincome, outcome: monthoutcome });
                    yield sequelize_2.default.query(yearincomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            yearincome = 0;
                        }
                        else {
                            yearincome = data[0][0].sum;
                        }
                    });
                    yield sequelize_2.default.query(yearoutcomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            yearoutcome = 0;
                        }
                        else {
                            yearoutcome = data[0][0].sum;
                        }
                    });
                    yeartotal = yearincome - yearoutcome;
                    dashboardData.push({ title: "Yearly Balance", total: yeartotal, income: yearincome, outcome: yearoutcome });
                    const returncode = "200";
                    const message = "Dashboard";
                    return { returncode, message, dashboardData: dashboardData };
                }
                catch (e) {
                    console.log(e);
                    return { returncode: 300, message: "Error in getting SUM", dashboardData: {} };
                    throw e;
                }
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
    GateDashboardBalance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: req.body.userid } }).then((data) => {
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
                // getting start date and end date
                try {
                    var curr = new Date(); // get current date
                    var first = curr.getDate() - curr.getDay();
                    var last = first + 6; // last day is the first day + 6
                    var today = (0, moment_1.default)(new Date(curr)).format('YYYY-MM-DD');
                    var startOfWeek = (0, moment_1.default)().startOf('isoWeek').toDate();
                    var endOfWeek = (0, moment_1.default)().endOf('isoWeek').toDate();
                    var startDateofWeek = (0, moment_1.default)(startOfWeek).format('YYYY-MM-DD');
                    var lastDateofWeek = (0, moment_1.default)(endOfWeek).format('YYYY-MM-DD');
                    var startDateofMonth = (0, moment_1.default)().startOf('month').format('YYYY-MM-DD');
                    var lastDateofMonth = (0, moment_1.default)().endOf('month').format('YYYY-MM-DD');
                    const currentYear = new Date().getFullYear();
                    const startoftheyear = new Date(currentYear, 0, 1);
                    var startDateofYear = (0, moment_1.default)(new Date(startoftheyear)).format('YYYY-MM-DD');
                    const lastoftheyear = new Date(currentYear, 11, 31);
                    var lastDateofYear = (0, moment_1.default)(new Date(lastoftheyear)).format('YYYY-MM-DD');
                    console.log("today is " + today);
                    console.log("first day of week -> " + startDateofWeek + " last day of week is -> " + lastDateofWeek);
                    console.log("first day of month -> " + startDateofMonth + " last day of month is -> " + lastDateofMonth);
                    console.log("first day of year -> " + startDateofYear + " last day of year is -> " + lastDateofYear);
                }
                catch (_a) {
                    return { returncode: "300", message: "Invalid Date", data: {} };
                }
                // creating date list from data with the requested date range
                // try {
                //   var dateList: any[] = [];
                //   await sequelize.query(`
                //   SELECT DISTINCT date FROM balances
                //   JOIN categories ON balances.category_id = categories.category_id
                //   where balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'
                //   ORDER BY balances.date DESC
                //   `).then((data: any) => {
                //     if (data) {
                //       data[0].map((item: any) => {
                //         if (item.category_type == 3 ) {
                //           dateList.push(item.date);
                //         }
                //       })
                //     }
                //   })
                //   console.log(dateList);
                // } catch {
                //   return { returncode: "300", message: "Error Getting Date List", data: {} };
                // }
                // createing search query according to user type
                var todayQuery = '';
                var todayincomeQuery = '';
                var todayoutcomeQuery = '';
                var weekincomeQuery = '';
                var weekoutcomeQuery = '';
                var monthincomeQuery = '';
                var monthoutcomeQuery = '';
                var yearincomeQuery = '';
                var yearoutcomeQuery = '';
                if (userRecord.usertype == 1) {
                    todayQuery = `SELECT * FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_isdeleted = 'false' and categories.category_type = '3' and 
          balances.date = '${today}';`;
                    todayincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_isdeleted = 'false' and categories.category_type = '3' and 
          balances.balance_type = '1' and 
          balances.date = '${today}';`;
                    todayoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_isdeleted = 'false' and categories.category_type = '3' and 
          balances.balance_type = '2' and 
          balances.date = '${today}';`;
                    weekincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and  categories.category_type = '3' and 
          balances.balance_type = '1' and 
          balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'`;
                    weekoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and  categories.category_type = '3' and 
          balances.balance_type = '2' and 
          balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'`;
                    monthincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and  categories.category_type = '3' and 
          balances.balance_type = '1' and 
          balances.date BETWEEN '${startDateofMonth}' AND '${lastDateofMonth}'`;
                    monthoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and  categories.category_type = '3' and 
          balances.balance_type = '2' and 
          balances.date BETWEEN '${startDateofMonth}' AND '${lastDateofMonth}'`;
                    yearincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and  categories.category_type = '3' and 
          balances.balance_type = '1' and 
          balances.date BETWEEN '${startDateofYear}' AND '${lastDateofYear}'`;
                    yearoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where balances.balance_isdeleted = 'false' and  categories.category_type = '3' and 
          balances.balance_type = '2' and 
          balances.date BETWEEN '${startDateofYear}' AND '${lastDateofYear}'`;
                }
                else if (userRecord.usertype == 2) {
                    todayQuery = `SELECT * FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.is_private = 'false' and  categories.category_type = '3' and 
          balances.balance_isdeleted = 'false' and 
          balances.date = '${today}';`;
                    todayincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.is_private = 'false' and  categories.category_type = '3' and 
          balances.balance_isdeleted = 'false' and 
          balances.balance_type = '1' and 
          balances.date = '${today}';`;
                    todayoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.is_private = 'false' and  categories.category_type = '3' and 
          balances.balance_isdeleted = 'false' and 
          balances.balance_type = '2' and 
          balances.date = '${today}';`;
                    weekincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '1' and  categories.category_type = '3' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'`;
                    weekoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '2' and  categories.category_type = '3' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofWeek}' AND '${lastDateofWeek}'`;
                    monthincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '1' and  categories.category_type = '3' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofMonth}' AND '${lastDateofMonth}'`;
                    monthoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '2' and  categories.category_type = '3' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofMonth}' AND '${lastDateofMonth}'`;
                    yearincomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '1' and  categories.category_type = '3' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofYear}' AND '${lastDateofYear}'`;
                    yearoutcomeQuery = `SELECT SUM(amount) FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          WHERE balances.balance_type = '2' and  categories.category_type = '3' and 
          balances.is_private = 'false' and 
          balances.balance_isdeleted = 'false' and
          balances.date BETWEEN '${startDateofYear}' AND '${lastDateofYear}'`;
                }
                else {
                    return { returncode: "300", message: "User has no authorization to view history.", data: {} };
                }
                var todayincome;
                var todayoutcome;
                var todaytotal;
                var weekincome;
                var weekoutcome;
                var weektotal;
                var monthincome;
                var monthoutcome;
                var monthtotal;
                var yearincome;
                var yearoutcome;
                var yeartotal;
                try {
                    var result;
                    var dashboardData = [];
                    yield sequelize_2.default.query(todayincomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            todayincome = 0;
                        }
                        else {
                            todayincome = data[0][0].sum;
                        }
                    });
                    yield sequelize_2.default.query(todayoutcomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            todayoutcome = 0;
                        }
                        else {
                            todayoutcome = data[0][0].sum;
                        }
                    });
                    todaytotal = todayincome - todayoutcome;
                    dashboardData.push({ title: "Today Balance", total: todaytotal, income: todayincome, outcome: todayoutcome });
                    yield sequelize_2.default.query(weekincomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            weekincome = 0;
                        }
                        else {
                            weekincome = data[0][0].sum;
                        }
                    });
                    yield sequelize_2.default.query(weekoutcomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            weekoutcome = 0;
                        }
                        else {
                            weekoutcome = data[0][0].sum;
                        }
                    });
                    weektotal = weekincome - weekoutcome;
                    dashboardData.push({ title: "Weekly Balance", total: weektotal, income: weekincome, outcome: weekoutcome });
                    yield sequelize_2.default.query(monthincomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            monthincome = 0;
                        }
                        else {
                            monthincome = data[0][0].sum;
                        }
                    });
                    yield sequelize_2.default.query(monthoutcomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            monthoutcome = 0;
                        }
                        else {
                            monthoutcome = data[0][0].sum;
                        }
                    });
                    monthtotal = monthincome - monthoutcome;
                    dashboardData.push({ title: "Monthly Balance", total: monthtotal, income: monthincome, outcome: monthoutcome });
                    yield sequelize_2.default.query(yearincomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            yearincome = 0;
                        }
                        else {
                            yearincome = data[0][0].sum;
                        }
                    });
                    yield sequelize_2.default.query(yearoutcomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            yearoutcome = 0;
                        }
                        else {
                            yearoutcome = data[0][0].sum;
                        }
                    });
                    yeartotal = yearincome - yearoutcome;
                    dashboardData.push({ title: "Yearly Balance", total: yeartotal, income: yearincome, outcome: yearoutcome });
                    const returncode = "200";
                    const message = "Dashboard";
                    return { returncode, message, dashboardData: dashboardData };
                }
                catch (e) {
                    console.log(e);
                    return { returncode: 300, message: "Error in getting SUM", dashboardData: {} };
                    throw e;
                }
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
    GetBalanceForSevenRows(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: req.body.userid } }).then((data) => {
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
                // getting start date and end date
                try {
                    var reqdateList = req.body.dateList;
                    var mydatestring = "";
                    reqdateList.map((item, index) => {
                        if (index < reqdateList.length - 1) {
                            mydatestring += "balances.date = '" + item + "' or ";
                        }
                        else {
                            mydatestring += "balances.date = '" + item + "'";
                        }
                    });
                }
                catch (_a) {
                    return { returncode: "300", message: "Invalid Date", data: {} };
                }
                // creating date list from data with the requested date range
                // createing search query according to user type
                var searchQuery = '';
                var filter = "(balances.balance_isdeleted = 'false') and " + mydatestring;
                if (req.body.category_id != []) {
                    console.log(req.body.category_id.length);
                    req.body.category_id.map((item, index) => {
                        if (req.body.category_id.length == 1) {
                            filter += " and (balances.category_id = '" + item + "')";
                        }
                        else {
                            if (index == req.body.category_id.length - 1) {
                                filter += " balances.category_id = '" + item + "')";
                            }
                            else {
                                if (index == 0) {
                                    filter += " and (balances.category_id = '" + item + "' or";
                                }
                                else {
                                    filter += " balances.category_id = '" + item + "' or";
                                }
                            }
                        }
                    });
                }
                if (req.body.keyword_id != "") {
                    filter += " and (balances.keyword_id = '" + req.body.keyword_id + "')";
                }
                if (req.body.balance_name != "") {
                    filter += " and (balances.balance_name LIKE '%" + req.body.balance_name + "%')";
                }
                if (req.body.balance_type != "") {
                    filter += " and (balances.balance_type = '" + req.body.balance_type + "')";
                }
                if (userRecord.usertype == 1) {
                    searchQuery = `
          SELECT 
          *
          FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where ${filter};`;
                }
                else if (userRecord.usertype == 2) {
                    searchQuery = `
            SELECT 
                *
            FROM balances 
            JOIN categories ON balances.category_id = categories.category_id
            LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
            WHERE balances.is_private = 'false' and ${filter};`;
                }
                else {
                    return { returncode: "300", message: "User has no authorization to view history.", data: {} };
                }
                try {
                    var result;
                    yield sequelize_2.default.query(searchQuery).then((data) => {
                        if (data) {
                            var temp = data[0];
                            var groupData = [];
                            var todaybalance = 0;
                            var todayincome = 0;
                            var todayoutcome = 0;
                            var balanceData = [];
                            reqdateList.map((date) => {
                                balanceData = temp.filter((x) => x.date == date);
                                if (balanceData.length > 0) {
                                    balanceData.map((item) => {
                                        var tempitem = {
                                            balance_id: item.balance_id,
                                            balance_type: item.balance_type,
                                            balance_name: item.balance_name,
                                            amount: item.amount,
                                            category_name: item.category_name,
                                            category_icon: item.category_icon,
                                            keyword_name: item.keyword_name,
                                            date: item.date,
                                            formatted_date: (0, moment_1.default)(new Date(item.date)).format('MMMM DD, YYYY'),
                                            userid: item.userid,
                                            car_inouttype: item.car_inouttype,
                                            balance_remark: item.balance_remark,
                                        };
                                        if (item.balance_type == 1) {
                                            todayincome += item.amount;
                                        }
                                        if (item.balance_type == 2) {
                                            todayoutcome += item.amount;
                                        }
                                        todaybalance = todayincome - todayoutcome;
                                    });
                                    groupData.push({ date: date, balance: todaybalance, balanceData });
                                    todaybalance = 0;
                                    todayincome = 0;
                                    todayoutcome = 0;
                                }
                            });
                            result = { returncode: "200", message: "Balance List for 7 days", data: groupData };
                        }
                        else {
                            result = { returncode: "300", message: "Balance list not found", data: {} };
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
    GetBalanceWithDateRange(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: req.body.userid } }).then((data) => {
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
                if (userRecord.usertype == 3) {
                    result = { returncode: "300", message: "User has no authorization to view history.", data: {} };
                }
                // getting start date and end date
                try {
                    var start_date = (0, moment_1.default)(new Date(req.body.start_date)).format('YYYY-MM-DD');
                    var end_date = (0, moment_1.default)(new Date(req.body.end_date)).format('YYYY-MM-DD');
                }
                catch (_a) {
                    return { returncode: "300", message: "Invalid Date" };
                }
                var dateCount;
                var filter = "(balances.balance_isdeleted = 'false')";
                var dateQuery = `
      SELECT DISTINCT date FROM balances
      where ${filter}
      ORDER BY balances.date DESC
      `;
                if (req.body.category_id != []) {
                    console.log(req.body.category_id.length);
                    req.body.category_id.map((item, index) => {
                        if (req.body.category_id.length == 1) {
                            filter += " and (balances.category_id = '" + item + "')";
                        }
                        else {
                            if (index == req.body.category_id.length - 1) {
                                filter += " balances.category_id = '" + item + "')";
                            }
                            else {
                                if (index == 0) {
                                    filter += " and (balances.category_id = '" + item + "' or";
                                }
                                else {
                                    filter += " balances.category_id = '" + item + "' or";
                                }
                            }
                        }
                    });
                }
                if (req.body.keyword_id != "") {
                    filter += " and (balances.keyword_id = '" + req.body.keyword_id + "')";
                }
                if (req.body.balance_name != "") {
                    filter += " and (balances.balance_name LIKE '%" + req.body.balance_name + "%')";
                }
                if (req.body.start_date != "") {
                    filter += " and (balances.date BETWEEN '" + start_date + "' AND '" + end_date + "')";
                }
                if (req.body.balance_type != "") {
                    filter += " and (balances.balance_type = '" + req.body.balance_type + "')";
                }
                if (userRecord.usertype == 2) {
                    filter += " and (balances.is_private = 'false')";
                }
                var dateQuery = `
        SELECT DISTINCT date FROM balances
        where ${filter}
        ORDER BY balances.date DESC
        `;
                // creating date list from data with the requested date range
                try {
                    var dateList = [];
                    yield sequelize_2.default.query(dateQuery).then((data) => {
                        if (data) {
                            data[0].map((item) => {
                                dateList.push(item.date);
                            });
                        }
                        dateCount = dateList.length;
                        console.log(dateList);
                    });
                }
                catch (_b) {
                    return { returncode: "300", message: "Error Getting Date List" };
                }
                var searchQuery = '';
                var sumincomeQuery = '';
                var sumoutcomeQuery = '';
                var sumincomefilter = '';
                var sumoutcomefilter = '';
                var sumIncome = 0;
                var sumOutcome = 0;
                var total = 0;
                sumincomefilter = filter + " and balances.balance_type = '1'";
                sumoutcomefilter = filter + " and balances.balance_type = '2'";
                searchQuery = `
          SELECT 
          *
          FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where ${filter};
          `;
                sumincomeQuery = `
          SELECT 
          SUM(amount)
          FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where ${sumincomefilter};
        `;
                sumoutcomeQuery = `
          SELECT 
          SUM(amount)
          FROM balances 
          JOIN categories ON balances.category_id = categories.category_id
          LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
          where ${sumoutcomefilter};
        `;
                var newDateList = [];
                var dateListToDelete = [];
                var dateListToRequest = [];
                newDateList = dateList;
                if (dateCount > 7) {
                    var dateList = dateList.slice(0, 7);
                    var dateListToRequest = newDateList.filter(item => !dateList.includes(item));
                    // dateListToRequest = dateList - dateListToDelete;
                    console.log(dateListToRequest);
                }
                try {
                    var result;
                    yield sequelize_2.default.query(sumincomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            sumIncome = 0;
                        }
                        else {
                            sumIncome = data[0][0].sum;
                        }
                    });
                    yield sequelize_2.default.query(sumoutcomeQuery).then((data) => {
                        if (data[0][0].sum == null) {
                            sumOutcome = 0;
                        }
                        else {
                            sumOutcome = data[0][0].sum;
                        }
                    });
                    total = sumIncome - sumOutcome;
                    yield sequelize_2.default.query(searchQuery).then((data) => {
                        if (data) {
                            var temp = data[0];
                            var groupData = [];
                            var todaybalance = 0;
                            var todayincome = 0;
                            var todayoutcome = 0;
                            var balanceData = [];
                            var total_balance = 0;
                            dateList.map((date) => {
                                balanceData = temp.filter((x) => x.date == date);
                                if (balanceData.length > 0) {
                                    balanceData.map((item) => {
                                        var tempitem = {
                                            balance_id: item.balance_id,
                                            balance_type: item.balance_type,
                                            balance_name: item.balance_name,
                                            amount: item.amount,
                                            category_name: item.category_name,
                                            category_icon: item.category_icon,
                                            keyword_name: item.keyword_name,
                                            date: item.date,
                                            formatted_date: (0, moment_1.default)(new Date(item.date)).format('MMMM DD, YYYY'),
                                            userid: item.userid,
                                            car_inouttype: item.car_inouttype,
                                            balance_remark: item.balance_remark,
                                        };
                                        if (item.balance_type == 1) {
                                            todayincome += item.amount;
                                        }
                                        if (item.balance_type == 2) {
                                            todayoutcome += item.amount;
                                        }
                                        todaybalance = todayincome - todayoutcome;
                                    });
                                    total_balance += todaybalance;
                                    groupData.push({ date: date, balance: todaybalance, balanceData });
                                    todaybalance = 0;
                                    todayincome = 0;
                                    todayoutcome = 0;
                                }
                            });
                            result =
                                {
                                    returncode: "200",
                                    message: 'Balance List for ' + dateCount + ' days',
                                    requestedRows: 7,
                                    dateList: dateListToRequest,
                                    totalBalance: total,
                                    sumIncome: sumIncome,
                                    sumOutcome: sumOutcome,
                                    data: groupData
                                };
                        }
                        else {
                            result = { returncode: "300", message: "Balance list not found", data: {} };
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
    GetBalanceDetails(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const Op = sequelize_1.default.Op;
            try {
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: req.body.userid } }).then((data) => {
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
                if (userRecord.usertype == 3) {
                    result = { returncode: "300", message: "User has no authorization to view history.", data: {} };
                }
                try {
                    var balanceRecord;
                    var result;
                    var searchQuery = `
        SELECT * FROM BALANCES 
        JOIN categories ON balances.category_id = categories.category_id 
        JOIN users ON balances.userid = users.userid
        LEFT JOIN keywords ON balances.keyword_id = keywords.keyword_id 
        LEFT JOIN car_histories ON balances.balance_id = car_histories.balance_id
        WHERE balances.balance_id = '${req.body.balance_id}' and balances.balance_isdeleted = 'false';`;
                    yield sequelize_2.default.query(searchQuery).then((data) => { var data; return __awaiter(this, void 0, void 0, function* () {
                        if (data[0] != []) {
                            console.log(data[0]);
                            const returncode = "200";
                            const message = "Balance Details";
                            var newdata;
                            var mydata = {
                                "balance_id": req.body.balance_id,
                                "category_type": data[0][0].category_type,
                                "category_id": data[0][0].category_id,
                                "category_name": data[0][0].category_name,
                                "balance_type": data[0][0].balance_type,
                                "balance_name": data[0][0].balance_name,
                                "keyword_id": data[0][0].keyword_id,
                                "keyword_name": data[0][0].keyword_name,
                                "car_inouttype": data[0][0].car_inouttype,
                                "amount": data[0][0].amount,
                                "date": data[0][0].date,
                                "balance_remark": data[0][0].balance_remark,
                                "user_id": data[0][0].userid,
                                "username": data[0][0].username,
                                "balance_isdeleted": data[0][0].balance_isdeleted,
                                "is_private": data[0][0].is_private,
                                "car_history_id": data[0][0].car_history_id,
                                "go_trip": data[0][0].go_trip,
                                "comeback_trip": data[0][0].comeback_trip,
                                "petrol_price": data[0][0].petrol_price,
                                "khout_kyay": data[0][0].khout_kyay,
                                "road_services": data[0][0].road_services,
                                "misc": data[0][0].misc,
                            };
                            var gate_details = [];
                            if (mydata.car_inouttype == '3') {
                                yield this.gate_historyModel.services.findAll({
                                    where: {
                                        balance_id: req.body.balance_id,
                                        gate_history_isdeleted: false
                                    }
                                }).then((data) => {
                                    if (data) {
                                        data.map((item) => {
                                            var tempitem = {
                                                gate_history_id: item.gate_history_id,
                                                car_no: item.car_no,
                                                car_amount: item.car_amount,
                                                trip_type: item.trip_type,
                                                gate_history_isdeleted: item.gate_history_isdeleted
                                            };
                                            gate_details.push(tempitem);
                                        });
                                    }
                                });
                            }
                            newdata = Object.assign(Object.assign({}, mydata), { gate_details });
                            console.log(newdata);
                            result = { returncode, message, data: newdata };
                        }
                        else {
                            console.log("Data not found");
                            const returncode = "300";
                            const message = "Balance not found";
                            result = { returncode, message, data };
                        }
                    }); });
                    return result;
                }
                catch (e) {
                    return { returncode: 300, message: "Error getting details" };
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
};
BalanceService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('userModel')),
    __param(1, (0, typedi_1.Inject)('balanceModel')),
    __param(2, (0, typedi_1.Inject)('car_historyModel')),
    __param(3, (0, typedi_1.Inject)('gate_historyModel')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], BalanceService);
exports.default = BalanceService;
