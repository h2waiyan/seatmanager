"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const typedi_1 = __importStar(require("typedi"));
const admin = require('firebase-admin');
const serviceAccount = require("./firebase-service-account.json");
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = __importDefault(require("../sequelize"));
const authorization_check_1 = __importDefault(require("./authorization_check"));
const schedule = require('node-schedule');
let NotiSetup = class NotiSetup {
    constructor(noti_deviceModel, userModel, noti_setupModel, noti_historyModel) {
        this.noti_deviceModel = noti_deviceModel;
        this.userModel = userModel;
        this.noti_setupModel = noti_setupModel;
        this.noti_historyModel = noti_historyModel;
    }
    FindNotiList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var countNotiList = [];
                yield this.noti_setupModel.services.findAll({ where: { is_sent: false, noti_isdeleted: false } }).then((data) => {
                    if (data) {
                        data.map((item) => {
                            var tempitem = {
                                noti_id: item.noti_id,
                                keyword_id: item.keyword_id,
                                category_id: item.category_id,
                                noti_data: item.noti_data,
                                start_date: item.start_date
                            };
                            if (item.noti_type == 1) {
                                countNotiList.push(tempitem);
                            }
                        });
                    }
                });
                var today = (0, moment_1.default)(new Date).format('YYYY-MM-DD');
                console.log("cheking noti list --------------------");
                console.log(countNotiList);
                countNotiList.map((item) => __awaiter(this, void 0, void 0, function* () {
                    var fromdate = (0, moment_1.default)(new Date(item.start_date)).format('YYYY-MM-DD');
                    var searchQuery = `SELECT * FROM balances 
                JOIN categories ON balances.category_id = categories.category_id 
                WHERE balances.category_id = '${item.category_id}' and 
                balances.car_inouttype = '2' and 
                balances.balance_isdeleted = 'false' and
                balances.date BETWEEN '${fromdate}' AND '${today}'`;
                    var databasecount;
                    yield sequelize_1.default.query(searchQuery).then((data) => {
                        if (data) {
                            databasecount = data[0].length;
                            console.log("dbcount -----> " + databasecount);
                        }
                    });
                    console.log("noti data ------->" + item.noti_data);
                    if (item.noti_data - databasecount == 1) {
                        var keyword_icon;
                        var keyword_name;
                        var category_name;
                        var notiQuery = `SELECT * FROM noti_setups 
                    JOIN categories ON noti_setups.category_id = categories.category_id
                    LEFT JOIN keywords ON noti_setups.keyword_id = keywords.keyword_id
                    WHERE noti_id = '${item.noti_id}'`;
                        yield sequelize_1.default.query(notiQuery).then((data) => {
                            if (data) {
                                keyword_icon = data[0][0]['keyword_icon'];
                                keyword_name = data[0][0]['keyword_name'];
                                category_name = data[0][0]['category_name'];
                            }
                        });
                        this.SendNoti(item.noti_id, keyword_icon, category_name, keyword_name, " ပြုပြင်ရန်အချိန်ကျပါပြီ။");
                        console.log("noti will be sent ----------> ß" + item.noti_id);
                    }
                }));
                return { returncode: "200", message: "success" };
            }
            catch (e) {
                console.log(e);
                return { returncode: "300", message: "fail" };
            }
        });
    }
    SendNoti(noti_id, keyword_icon, category_name, keyword_name, messageText) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (admin.apps.length === 0) {
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount)
                    });
                }
                // getting fcm token list to send noti
                var fcmtokenlist;
                var userlist;
                yield this.noti_deviceModel.services.findAll({}).then((data) => {
                    if (data) {
                        var templist = [];
                        var usertemplist = [];
                        data.map((item) => {
                            if (usertemplist.includes(item.userid) == false) {
                                usertemplist.push(item.userid);
                            }
                            if (item.fcmtoken != "") {
                                templist.push(item.fcmtoken);
                                console.log(item);
                            }
                        });
                        fcmtokenlist = templist;
                        userlist = usertemplist;
                        console.log(userlist);
                    }
                });
                console.log(fcmtokenlist);
                userlist.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const noti_history_id = "noti_history_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                    var noti_history_data = {
                        noti_history_id: noti_history_id,
                        noti_id: noti_id,
                        userid: item,
                        datetime: Date.now()
                    };
                    console.log(noti_history_data);
                    var newRecord;
                    yield this.noti_historyModel.services.create(noti_history_data).then((data) => {
                        console.log(noti_history_data);
                        newRecord = data;
                    });
                    console.log(newRecord);
                }));
                var payload = {
                    "notification": {
                        "title": keyword_name,
                        "body": category_name + " ၏ " + keyword_name + messageText,
                        // "image" : "https://pbs.twimg.com/media/D_Sr-bjVUAAu6ua.jpg:large"
                    },
                };
                admin.messaging().sendToDevice(fcmtokenlist, payload).then(function () {
                    console.log("successss--------------");
                });
                var newRecord;
                var update = { is_sent: true };
                var filter = { noti_id: noti_id };
                yield this.noti_setupModel.services
                    .update(update, {
                    where: filter,
                }).then((data) => {
                    newRecord = data;
                });
                return "success";
            }
            catch (e) {
                console.log(e);
                return "fail";
            }
        });
    }
    GetNotiList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var searchQuery = `SELECT * FROM noti_histories 
                JOIN noti_setups ON noti_histories.noti_id = noti_setups.noti_id 
                JOIN categories ON noti_setups.category_id = categories.category_id 
                LEFT JOIN keywords ON noti_setups.keyword_id = keywords.keyword_id
                WHERE userid = '${req.body.userid}'
                ORDER BY datetime DESC`;
                var mydata = [];
                var notitext;
                yield sequelize_1.default.query(searchQuery).then((data) => {
                    if (data) {
                        console.log(data);
                        data[0].map((item) => {
                            if (item.noti_type == '1') {
                                var noti_data = 0;
                                noti_data = item.noti_data - 1;
                                var tempitem = {
                                    noti_history_id: item.noti_history_id,
                                    category_id: item.category_id,
                                    keyword_id: item.keyword_id,
                                    is_seen: item.is_seen,
                                    keyword_icon: item.keyword_icon,
                                    notitext: item.category_name + " ၏ " + item.keyword_name + " ပြုပြင်ရန် အချိန်ကျပါပြီ။",
                                    info: item.category_name + " ၏ " + item.keyword_name + " ကို " + item.noti_data
                                        + " ခေါက်မြောက်တွင် ပြုပြင်ရန် " + (0, moment_1.default)(new Date(item.start_date)).format('DD-MM-YYYY') + " နေ့က သတ်မှတ်ခဲ့ပါသည်။ ယခု " + noti_data +
                                        " ခေါက်ရှိပြီဖြစ်ပါသည်။",
                                };
                                mydata.push(tempitem);
                            }
                            else {
                                var tempitem = {
                                    noti_history_id: item.noti_history_id,
                                    category_id: item.category_id,
                                    keyword_id: item.keyword_id,
                                    is_seen: item.is_seen,
                                    keyword_icon: item.keyword_icon,
                                    notitext: item.category_name + " ၏ " + item.keyword_name + " သက်တမ်းတိုးရန် အချိန်ကျပါပြီ။",
                                    info: item.category_name + " ၏ " + item.keyword_name + " ကို " + (0, moment_1.default)(new Date(item.noti_data)).format('DD-MM-YYYY') + " ရက်တွင် သက်တမ်းတိုးရန် "
                                        + item.start_date + " နေ့က သတ်မှတ်ခဲ့ပါသည်။ ယနေ့ " + (0, moment_1.default)(new Date(item.noti_data)).format('DD-MM-YYYY') + " ရက်ဖြစ်ပါသည်။",
                                };
                                mydata.push(tempitem);
                            }
                        });
                    }
                });
                return { returncode: "200", message: "Noti List", data: mydata, notitext: notitext };
            }
            catch (e) {
                console.log(e);
                return { returncode: "300", message: "fail" };
            }
        });
    }
    NotiSeen(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_1.default.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.userCheck(req);
            if (userRecord == "user-not-found") {
                return { returncode: "300", message: "User Not Found" };
            }
            try {
                var result;
                var filter = { noti_history_id: req.body.noti_history_id };
                var update = {
                    is_seen: true,
                };
                yield this.noti_historyModel.services
                    .update(update, {
                    where: filter,
                }).then((data) => {
                    if (data) {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Noti status changed successfully' };
                        }
                        else {
                            result = { returncode: "300", message: 'Error updating noti status' };
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
    RemoveNoti(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_1.default.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.userCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "User Not Found" };
            }
            try {
                var dataCheck;
                yield this.noti_historyModel.services.findAll({ where: { noti_history_id: req.body.noti_history_id } }).then((data) => {
                    if (data.length > 0) {
                        dataCheck = data[0];
                    }
                });
                if (!dataCheck) {
                    return { returncode: "300", message: "Noti Not Found" };
                }
                var newRecord;
                yield this.noti_historyModel.services.destroy({ where: { noti_history_id: req.body.noti_history_id } }).then((data) => {
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
};
NotiSetup = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('noti_deviceModel')),
    __param(1, (0, typedi_1.Inject)('userModel')),
    __param(2, (0, typedi_1.Inject)('noti_setupModel')),
    __param(3, (0, typedi_1.Inject)('noti_historyModel')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], NotiSetup);
exports.default = NotiSetup;
