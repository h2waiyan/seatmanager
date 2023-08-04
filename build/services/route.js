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
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    constructor(routeModel, gateListModel, userModel) {
        this.routeModel = routeModel;
        this.gateListModel = gateListModel;
        this.userModel = userModel;
    }
    CreateRoute(IRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            var adminuserCheck;
            yield this.userModel.services.findAll({ where: { userid: IRoute.userid, isdeleted: false } }).then((data) => {
                if (data.length > 0) {
                    adminuserCheck = data[0];
                }
            });
            if (!adminuserCheck) {
                return { returncode: "300", message: "User Not Found" };
            }
            if (adminuserCheck.usertype == 3) {
                return { returncode: "300", message: "User has no aurhorization to create new route." };
            }
            try {
                const route_id = "route_id" + (0, uuid_1.v4)();
                const routeData = {
                    userid: IRoute.userid,
                    gate_id: IRoute.gate_id,
                    route_id: route_id,
                    route_name: IRoute.route_name,
                    remark: IRoute.remark,
                    route_isdeleted: IRoute.route_isdeleted
                };
                var routeCheck;
                yield this.routeModel.services.findAll({
                    where: {
                        route_id: route_id,
                        route_isdeleted: false
                    }
                }).then((data) => {
                    if (data.length > 0) {
                        routeCheck = data[0];
                    }
                });
                if (routeCheck) {
                    return { returncode: "300", message: "Gate Already Exist." };
                }
                var gateRecord;
                yield this.routeModel.services.create(routeData).then((data) => {
                    gateRecord = data;
                });
                return { returncode: "200", message: "Success" };
            }
            catch (e) {
                console.log(e);
                return { returncode: "300", message: "Fail" };
            }
        });
    }
    GetAllRoutes(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const Op = sequelize_1.default.Op;
            try {
                var userRecord;
                console.log(req.body.userid);
                // Mysql function to find data
                // before updating the password, we need to check user is registered or not
                yield this.userModel.services.findAll({ where: { userid: req.body.userid } }).then((data) => {
                    if (data.length > 0) {
                        userRecord = data[0];
                    }
                });
                if (!userRecord) {
                    const returncode = "300";
                    const message = "Admin Not Found";
                    var data;
                    return { returncode, message, data };
                }
                else {
                    var gateResult;
                    var result;
                    var templist = [];
                    try {
                        yield this.gateListModel.services.findAll({ where: { gate_isdeleted: false } }).then((data) => {
                            if (data) {
                                gateResult = data;
                            }
                        });
                        yield this.routeModel.services.findAll({ where: { route_isdeleted: false } }).then((data) => {
                            if (data) {
                                const returncode = "200";
                                const message = "Route List";
                                data.map((item) => {
                                    gateResult.map((el) => {
                                        if (item.gate_id == el.gate_id) {
                                            var tempitem = {
                                                route_id: item.route_id,
                                                route_name: item.route_name,
                                                remark: item.remark,
                                                route_isdeleted: item.route_isdeleted,
                                                userid: item.userid,
                                                gate_id: el.gate_id,
                                                gate_name: el.gate_name
                                            };
                                            templist.push(tempitem);
                                        }
                                    });
                                });
                                console.log(templist);
                                // return { returncode, message, data };
                                result = {
                                    returncode, message, data: templist
                                };
                            }
                            else {
                                const returncode = "300";
                                const message = "Route list not found";
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
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    GetWithGate(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const Op = sequelize_1.default.Op;
            try {
                var userRecord;
                console.log(req.body.userid);
                // Mysql function to find data
                // before updating the password, we need to check user is registered or not
                yield this.userModel.services.findAll({ where: { userid: req.body.userid } }).then((data) => {
                    if (data.length > 0) {
                        userRecord = data[0];
                    }
                });
                if (!userRecord) {
                    const returncode = "300";
                    const message = "Admin Not Found";
                    var data;
                    return { returncode, message, data };
                }
                else {
                    try {
                        var result;
                        // Mysql function to delete data
                        yield this.routeModel.services.findAll({ where: { gate_id: req.body.gate_id, route_isdeleted: false } }).then((data) => {
                            if (data) {
                                const returncode = "200";
                                const message = "Route List";
                                console.log(data);
                                // return { returncode, message, data };
                                result = { returncode, message, data };
                            }
                            else {
                                const returncode = "300";
                                const message = "Route list not found";
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
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    DeleteRoute(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var userRecord;
            yield this.userModel.services.findAll({ where: { userid: req.body.userid, isdeleted: false } }).then((data) => {
                if (data.length > 0) {
                    userRecord = data[0];
                }
            });
            if (!userRecord) {
                var data;
                return { returncode: "300", message: "Admin Not Registered", data };
            }
            // var checkResult = this.checkUserAuth(userRecord);
            // return checkResult!;
            if (userRecord.usertype == 3) {
                var data;
                return { returncode: "300", message: "User has no authorization to delete users.", data };
            }
            /**
             * We use verify from argon2 to prevent 'timing based' attacks
             */
            const filter = { route_id: req.body.route_id, route_isdeleted: false };
            const update = { route_isdeleted: true };
            try {
                var deleteRecord;
                yield this.routeModel.services.findAll({ where: filter }).then((data) => {
                    if (data.length > 0) {
                        deleteRecord = data[0];
                    }
                });
                if (!deleteRecord) {
                    const returncode = "300";
                    const message = "Route you want to delete is not registered";
                    var data;
                    return { returncode, message, data };
                }
                var result;
                yield this.routeModel.services
                    .update(update, {
                    where: filter,
                })
                    .then((data) => {
                    if (data == 1) {
                        result = { returncode: "200", message: 'Route Deleted successfully!' };
                    }
                    else {
                        result = { returncode: "300", message: 'Error deleting route' };
                    }
                });
                return result;
            }
            catch (e) {
                throw e;
            }
        });
    }
    updateRoute(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: req.body.userid, isdeleted: false } }).then((data) => {
                    if (data.length > 0) {
                        userRecord = data[0];
                    }
                });
                if (!userRecord) {
                    return { returncode: "300", message: "User Not Registered" };
                }
                const filter = { route_id: req.body.route_id };
                const update = {
                    userid: req.body.userid,
                    route_name: req.body.route_name,
                    remark: req.body.remark,
                    route_isdeleted: req.body.route_isdeleted
                };
                try {
                    var result;
                    // Mysql function to update data
                    yield this.routeModel.services
                        .update(update, {
                        where: filter,
                    })
                        .then((data) => {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Route updated successfully!' };
                        }
                        else {
                            result = { returncode: "300", message: 'Error updating Route' };
                        }
                    });
                    return result;
                }
                catch (e) {
                    throw e;
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
};
AuthService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('routeModel')),
    __param(1, (0, typedi_1.Inject)('gateListModel')),
    __param(2, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object, Object, Object])
], AuthService);
exports.default = AuthService;
