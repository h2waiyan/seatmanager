"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let ValidationService = class ValidationService {
    // users
    createUserRequest(req) {
        if ((req.body.userid &&
            req.body.createuserid &&
            req.body.username &&
            req.body.usertype &&
            req.body.password) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.createuserid && req.body.username && req.body.usertype && req.body.password) == "") {
            return "blankfield";
        }
    }
    changePwdRequest(req) {
        if ((req.body.userid && req.body.password && req.body.newpassword) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.password && req.body.newpassword) == "") {
            return "blankfield";
        }
    }
    deleteUserRequest(req) {
        if ((req.body.userid && req.body.deleteuserid) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.deleteuserid) == "") {
            return "blankfield";
        }
    }
    reactivateUserRequest(req) {
        if ((req.body.userid && req.body.deleteduserid) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.deleteduserid) == "") {
            return "blankfield";
        }
    }
    resetUserPwdRequest(req) {
        if ((req.body.userid && req.body.changepwduserid && req.body.newpassword) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.changepwduserid && req.body.newpassword) == "") {
            return "blankfield";
        }
    }
    editRequest(req) {
        if ((req.body.userid && req.body.username && req.body.edituserid && req.body.usertype) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.username && req.body.edituserid && req.body.usertype) == "") {
            return "blankfield";
        }
    }
    getUserRequest(req) {
        if ((req.body.userid) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid) == "") {
            return "blankfield";
        }
    }
    getUserDetailsRequest(req) {
        if ((req.body.userid) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.detailsuserid) == "") {
            return "blankfield";
        }
    }
    signinrequest(req) {
        if ((req.body.userid && req.body.uuid && req.body.password) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.uuid && req.body.password) == "") {
            return "blankfield";
        }
    }
    refreshTokenRequest(req) {
        if ((req.body.userid && req.body.token) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.token) == "") {
            return "blankfield";
        }
    }
    // income/outcome category
    createCategoryRequest(req) {
        if ((req.body.userid && req.body.category_name && req.body.category_type) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.category_name && req.body.category_type) == "") {
            return "blankfield";
        }
    }
    CreateDebtRequest(req) {
        if ((req.body.userid && req.body.debt_type && req.body.amount && req.body.due_date) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.debt_type && req.body.amount && req.body.due_date) == "") {
            return "blankfield";
        }
    }
    EditDebtRequest(req) {
        if ((req.body.userid && req.body.debt_list_id) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.debt_list_id) == "") {
            return "blankfield";
        }
    }
    CreateBuySellCarsRequest(req) {
        if ((req.body.userid && req.body.buy_sell_type && req.body.amount && req.body.car_no && req.body.car_type) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.buy_sell_type && req.body.amount && req.body.car_no && req.body.car_type) == "") {
            return "blankfield";
        }
    }
    EditBuySellCarsRequest(req) {
        if ((req.body.userid && req.body.buy_sell_cars_id) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.buy_sell_cars_id) == "") {
            return "blankfield";
        }
    }
    getCategoryRequest(req) {
        if ((req.body.userid) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid) == "") {
            return "blankfield";
        }
    }
    editCategoryRequest(req) {
        if ((req.body.userid && req.body.category_id) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.category_id) == "") {
            return "blankfield";
        }
    }
    DeleteNotiDeviceRequest(req) {
        if ((req.body.userid && req.body.uuid) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.uuid) == "") {
            return "blankfield";
        }
    }
    SetupNotiRequest(req) {
        if ((req.body.userid && req.body.noti_type && req.body.noti_data && req.body.category_id && req.body.keyword_id) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.noti_type && req.body.noti_data && req.body.category_id && req.body.keyword_id) == "") {
            return "blankfield";
        }
    }
    EditNotiRequest(req) {
        if ((req.body.userid && req.body.noti_id && req.body.noti_type && req.body.noti_data && req.body.category_id && req.body.keyword_id) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.noti_id && req.body.noti_type && req.body.noti_data && req.body.category_id && req.body.keyword_id) == "") {
            return "blankfield";
        }
    }
    NotiListRequest(req) {
        if ((req.body.userid) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid) == "") {
            return "blankfield";
        }
    }
    NotiSeenAndRemoveRequest(req) {
        if ((req.body.userid && req.body.noti_history_id) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.noti_history_id) == "") {
            return "blankfield";
        }
    }
    GetNotiDetailsRequest(req) {
        if ((req.body.userid && req.body.noti_id) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.noti_id) == "") {
            return "blankfield";
        }
    }
    CreateKeywordRequest(req) {
        if ((req.body.userid && req.body.keyword_name) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.keyword_name) == "") {
            return "blankfield";
        }
    }
    GetKeywordRequest(req) {
        if ((req.body.userid) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid) == "") {
            return "blankfield";
        }
    }
    EditKeywordRequest(req) {
        if ((req.body.userid && req.body.keyword_id && req.body.keyword_name && req.body.keyword_isdeleted) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.keyword_id && req.body.keyword_name && req.body.keyword_isdeleted) == "") {
            return "blankfield";
        }
    }
    CreateBalanceRequest(req) {
        if (req.body.car_inouttype == 2) {
            if ((req.body.userid && req.body.category_id && req.body.balance_type &&
                req.body.balance_name && req.body.car_inouttype && req.body.amount && req.body.date &&
                req.body.go_trip && req.body.comeback_trip && req.body.petrol_price && req.body.khout_kyay
                && req.body.road_services && req.body.misc) == undefined) {
                return "incorrectfield";
            }
            if ((req.body.userid && req.body.category_id && req.body.balance_type && req.body.balance_name &&
                req.body.car_inouttype && req.body.amount && req.body.date &&
                req.body.go_trip && req.body.comeback_trip && req.body.petrol_price && req.body.khout_kyay
                && req.body.road_services && req.body.misc) == "") {
                return "blankfield";
            }
        }
        else {
            if ((req.body.userid && req.body.category_id && req.body.balance_type &&
                req.body.balance_name && req.body.car_inouttype && req.body.amount && req.body.date) == undefined) {
                return "incorrectfield";
            }
            if ((req.body.userid && req.body.category_id && req.body.balance_type && req.body.balance_name &&
                req.body.car_inouttype && req.body.amount && req.body.date) == "") {
                return "blankfield";
            }
        }
    }
    GetTodayUserBalanceRequest(req) {
        if ((req.body.userid && req.body.date) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.date) == "") {
            return "blankfield";
        }
    }
    GetDashboardBalanceRequest(req) {
        if ((req.body.userid) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid) == "") {
            return "blankfield";
        }
    }
    BalanceFilterRequest(req) {
        if ((req.body.userid) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid) == undefined) {
            return "blankfield";
        }
    }
    NextSevenRowsRequest(req) {
        if ((req.body.userid && req.body.dateList) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.dateList) == undefined) {
            return "blankfield";
        }
    }
    GetBalanceDetails(req) {
        if ((req.body.userid && req.body.balance_id) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.balance_id) == undefined) {
            return "blankfield";
        }
    }
    EditBalanceRequest(req) {
        if ((req.body.userid && req.body.category_id && req.body.balance_type &&
            req.body.balance_name && req.body.car_inouttype && req.body.amount && req.body.date
            && req.body.balance_id) == undefined) {
            return "incorrectfield";
        }
        if ((req.body.userid && req.body.category_id && req.body.balance_type && req.body.balance_name &&
            req.body.car_inouttype && req.body.amount && req.body.date &&
            req.body.balance_id) == "") {
            return "blankfield";
        }
    }
    AddCarBalanceHistoryRequest(req) {
        //   request parameter contain or not
        if ((req.body.userid && req.body.balance_id && req.body.go_trip && req.body.comeback_trip &&
            req.body.petrol_price && req.body.khout_kyay && req.body.road_services &&
            req.body.misc && req.body.total_amount) == undefined) {
            return "incorrectfield";
        }
        //   field blank or not
        if ((req.body.userid && req.body.balance_id && req.body.go_trip && req.body.comeback_trip &&
            req.body.petrol_price && req.body.khout_kyay && req.body.road_services &&
            req.body.misc && req.body.total_amount) == "") {
            return "blankfield";
        }
    }
};
ValidationService = __decorate([
    (0, typedi_1.Service)()
], ValidationService);
exports.default = ValidationService;
