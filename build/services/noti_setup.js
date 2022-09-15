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
const send_noti_1 = __importDefault(require("./send_noti"));
// import moment from 'moment';
var moment = require('moment-timezone');
const schedule = require('node-schedule');
let NotiSetup = class NotiSetup {
    constructor(keywordModel, categoryModel, noti_deviceModel, userModel, noti_setupModel, noti_historyModel) {
        this.keywordModel = keywordModel;
        this.categoryModel = categoryModel;
        this.noti_deviceModel = noti_deviceModel;
        this.userModel = userModel;
        this.noti_setupModel = noti_setupModel;
        this.noti_historyModel = noti_historyModel;
    }
    SetUpNoti(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const noti_id = "noti_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                const notiData = Object.assign({ noti_id }, req.body);
                var dataCheck;
                yield this.noti_setupModel.services.findAll({
                    where: { noti_id: noti_id }
                }).then((data) => {
                    if (data.length > 0) {
                        dataCheck = data[0];
                    }
                });
                if (dataCheck) {
                    const returncode = "300";
                    const message = "Noti ID already exists. Try agian.";
                    return { returncode, message };
                }
                // add record to noti_setup table
                var newRecord;
                yield this.noti_setupModel.services.create(notiData).then((data) => {
                    console.log(notiData);
                    newRecord = data;
                });
                try {
                    var keyword_icon;
                    var keyword_name;
                    var category_name;
                    var notiQuery = `SELECT * FROM noti_setups 
                JOIN categories ON noti_setups.category_id = categories.category_id
                LEFT JOIN keywords ON noti_setups.keyword_id = keywords.keyword_id
                WHERE noti_id = '${noti_id}'`;
                    yield sequelize_2.default.query(notiQuery).then((data) => {
                        if (data) {
                            keyword_icon = data[0][0][keyword_icon];
                            keyword_name = data[0][0]['keyword_name'];
                            category_name = data[0][0]['category_name'];
                        }
                    });
                    if (req.body.noti_type == "1") {
                        console.log("herereeeeee......");
                    }
                    if (req.body.noti_type == "2") {
                        console.log(req.body.noti_type);
                        var mylist = req.body.noti_data.split('-');
                        var year = mylist[0];
                        var month = mylist[1];
                        var day = mylist[2];
                        // var scheduleDate = new Date(year, month, day, 9, 55, 0);
                        // scheduleDate = new Date('2022-06-01T19:04:00.000Z');
                        var dateText = `${year}-${month}-${day}T09:00:00.000+06:30`;
                        var scheduleDate = new Date(dateText);
                        // scheduleDate.toLocaleString('en-US', { timeZone: 'Asia/Yangon' });
                        console.log(scheduleDate.toString());
                        var birthDayGift = '🎁';
                        const job = schedule.scheduleJob(noti_id, scheduleDate, () => {
                            console.log("calling noti send function ------");
                            var sendNotiService = typedi_2.Container.get(send_noti_1.default);
                            sendNotiService.SendNoti(noti_id, keyword_icon, category_name, keyword_name, " သက်တမ်းတိုးရန်အချိန်ကျပါပြီ");
                        });
                        // async function (SendNoti: any) {
                        //     console.log("noti send function called ++++++++ ")
                        //     // send noti function 
                        //     var notisending = await ;
                        //     if (notisending == 'success') {
                        //         console.log('Noti sent successfully', noti_id);
                        //     }
                        //     if (notisending == 'fail') {
                        //         console.log("Noti failed");
                        //     }
                        // }.bind(null, birthDayGift = '')
                    }
                }
                catch (e) {
                    console.log(e);
                    return { returncode: "300", message: "fail-----" };
                }
                return { returncode: "200", message: "success" };
            }
            catch (e) {
                console.log(e);
                return { returncode: "300", message: "fail" };
            }
        });
    }
    getNotiDetails(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.adminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "Admin Not Found", data: {} };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create Category.", data: {} };
            }
            try {
                var result;
                var filter = { noti_id: req.body.noti_id, noti_isdeleted: false };
                // Mysql function to delete dat{a
                yield this.noti_setupModel.services.findAll({ where: filter }).then((data) => {
                    if (data) {
                        const returncode = "200";
                        const message = "Noti Settings Details";
                        const mydata = {
                            "noti_id": data[0].noti_id,
                            "noti_type": data[0].noti_type,
                            "category_id": data[0].category_id,
                            "noti_data": data[0].noti_data,
                            "keyword_id": data[0].keyword_id,
                            "start_date": data[0].start_date
                        };
                        result = { returncode, message, data: mydata };
                    }
                    else {
                        const returncode = "300";
                        const message = "Noti Settings Not Found";
                        var data;
                        result = { returncode, message, data };
                        // throw new Error('Error getting the users.');
                    }
                });
                return result;
            }
            catch (e) {
                throw e;
            }
        });
    }
    getNotiList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const Op = sequelize_1.default.Op;
            try {
                var AuthroizationCheckService = typedi_2.Container.get(authorization_check_1.default);
                var userRecord = yield AuthroizationCheckService.adminCheck(req);
                if (userRecord == "admin-not-found") {
                    return { returncode: "300", message: "User Not Found" };
                }
                if (userRecord == "user-has-no-authorization") {
                    return { returncode: "300", message: "User Had no authorization to set up noti." };
                }
                try {
                    var result;
                    var mydata;
                    yield sequelize_2.default.query(`
                SELECT 
                    *
                FROM noti_setups 
                JOIN categories ON noti_setups.category_id = categories.category_id
                JOIN keywords ON noti_setups.keyword_id = keywords.keyword_id
                WHERE noti_setups.noti_isdeleted = 'false'
                `).then((data) => {
                        if (data) {
                            const returncode = "200";
                            const message = "Noti List";
                            var templist = [];
                            data[0].map((item) => {
                                var tempitem = {
                                    noti_id: item.noti_id,
                                    category_icon: item.category_icon,
                                    category_name: item.category_name,
                                    category_icon_and_name: item.category_icon + " " + item.category_name,
                                    noti_type: item.noti_type,
                                    noti_data: item.noti_data,
                                    keyword_icon: item.keyword_icon,
                                    keyword_name: item.keyword_name,
                                    is_sent: item.is_sent
                                };
                                templist.push(tempitem);
                            });
                            result = { returncode, message, data: templist };
                        }
                        else {
                            const returncode = "300";
                            const message = "Noti list not found";
                            var data;
                            result = { returncode, message, data };
                        }
                    });
                    return result;
                }
                catch (e) {
                    console.log(e);
                    result = { returncode: "300", message: "Error" };
                    return result;
                    throw e;
                }
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
    EditNoti(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.adminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "User Not Found" };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create Category." };
            }
            const Op = sequelize_1.default.Op;
            try {
                var result;
                var filter = { noti_id: req.body.noti_id };
                var update = {
                    category_id: req.body.category_id,
                    noti_type: req.body.noti_type,
                    noti_data: req.body.noti_data,
                    start_date: req.body.start_date,
                    keyword_id: req.body.keyword_id,
                };
                if (req.body.noti_type == "2") {
                    var mylist = req.body.noti_data.split('-');
                    var year = mylist[0];
                    var month = mylist[1];
                    var day = mylist[2];
                    var dateText = `${year}-${month}-${day}T09:00:00.000+06:30`;
                    var newscheduleDate = new Date(dateText);
                    console.log("------------>" + newscheduleDate.toString());
                }
                yield this.noti_setupModel.services
                    .update(update, {
                    where: filter,
                }).then((data) => {
                    if (data) {
                        console.log(data);
                        if (data == 1) {
                            if (req.body.noti_type == "2") {
                                var keyword_icon;
                                var keyword_name;
                                var category_name;
                                var notiQuery = `SELECT * FROM noti_setups 
                                JOIN categories ON noti_setups.category_id = categories.category_id
                                LEFT JOIN keywords ON noti_setups.keyword_id = keywords.keyword_id
                                WHERE noti_id = '${req.body.noti_id}'`;
                                sequelize_2.default.query(notiQuery).then((data) => {
                                    if (data) {
                                        keyword_icon = data[0][0][keyword_icon];
                                        keyword_name = data[0][0]['keyword_name'];
                                        category_name = data[0][0]['category_name'];
                                    }
                                });
                                schedule.cancelJob(req.body.noti_id);
                                const job = schedule.scheduleJob(req.body.noti_id, newscheduleDate, () => {
                                    console.log("calling againnnnnnnnn noti send function ------");
                                    var sendNotiService = typedi_2.Container.get(send_noti_1.default);
                                    sendNotiService.SendNoti(req.body.noti_id, keyword_icon, category_name, keyword_name, " သက်တမ်းတိုးရန်အချိန်ကျပါပြီ");
                                });
                            }
                            result = { returncode: "200", message: 'Noti Updated successfully' };
                        }
                        else {
                            console.log(data);
                            result = { returncode: "300", message: 'Error upading Noti' };
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
    DeleteNoti(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.adminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "User Not Found" };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create Noti." };
            }
            try {
                var dataCheck;
                yield this.noti_setupModel.services.findAll({ where: { noti_id: req.body.noti_id } }).then((data) => {
                    if (data.length > 0) {
                        dataCheck = data[0];
                    }
                });
                if (!dataCheck) {
                    return { returncode: "300", message: "Noti Not Found" };
                }
                if (dataCheck.noti_type == "2") {
                    schedule.cancelJob(req.body.noti_id);
                }
                var newRecord;
                var update = { noti_isdeleted: true };
                var filter = { noti_id: req.body.noti_id };
                yield this.noti_setupModel.services
                    .update(update, {
                    where: filter,
                }).then((data) => {
                    this.noti_historyModel.services.destroy({ where: { noti_id: req.body.noti_id } }).then((data) => {
                        newRecord = data;
                    });
                });
                return { returncode: "200", message: "success" };
            }
            catch (e) {
                return { returncode: "300", message: "fail" };
            }
        });
    }
};
NotiSetup = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('keywordModel')),
    __param(1, (0, typedi_1.Inject)('categoryModel')),
    __param(2, (0, typedi_1.Inject)('noti_deviceModel')),
    __param(3, (0, typedi_1.Inject)('userModel')),
    __param(4, (0, typedi_1.Inject)('noti_setupModel')),
    __param(5, (0, typedi_1.Inject)('noti_historyModel')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], NotiSetup);
exports.default = NotiSetup;
