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
    constructor(gateListModel, userModel) {
        this.gateListModel = gateListModel;
        this.userModel = userModel;
    }
    CreateGate(IGate) {
        return __awaiter(this, void 0, void 0, function* () {
            var adminuserCheck;
            yield this.userModel.services.findAll({ where: { userid: IGate.userid, isdeleted: false } }).then((data) => {
                if (data.length > 0) {
                    adminuserCheck = data[0];
                }
            });
            if (!adminuserCheck) {
                return { returncode: "300", message: "User Not Found" };
            }
            if (adminuserCheck.usertype == 3) {
                return { returncode: "300", message: "User has no aurhorization to create new gate." };
            }
            try {
                const gate_id = "gate_id_" + (0, uuid_1.v4)();
                const gateData = {
                    gate_id: gate_id,
                    userid: IGate.userid,
                    gate_name: IGate.gate_name,
                    gate_location: IGate.location,
                    remark: IGate.remark,
                    gate_isdeleted: IGate.gate_isdeleted
                };
                var gateCheck;
                yield this.gateListModel.services.findAll({
                    where: {
                        gate_id: gate_id,
                        gate_isdeleted: false
                    }
                }).then((data) => {
                    if (data.length > 0) {
                        gateCheck = data[0];
                    }
                });
                if (gateCheck) {
                    return { returncode: "300", message: "Gate Already Exist." };
                }
                var gateRecord;
                yield this.gateListModel.services.create(gateData).then((data) => {
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
    GetGates(req) {
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
                    // if (userRecord.usertype == 1 || userRecord.usertype == 2) {
                    try {
                        var result;
                        // Mysql function to delete data
                        yield this.gateListModel.services.findAll({ where: { gate_isdeleted: false } }).then((data) => {
                            if (data) {
                                const returncode = "200";
                                const message = "Gate List";
                                console.log(data);
                                // return { returncode, message, data };
                                result = { returncode, message, data };
                            }
                            else {
                                const returncode = "300";
                                const message = "Gate list not found";
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
                    // }
                    // else {
                    //     const returncode = "300";
                    //     const message = "User has no authorization to get all users."
                    //     var data: any;
                    //     return { returncode, message, data };
                    // }
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    DeleteGate(req) {
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
            const filter = { gate_id: req.body.gate_id, gate_isdeleted: false };
            const update = { gate_isdeleted: true };
            try {
                var deletegateRecord;
                yield this.gateListModel.services.findAll({ where: filter }).then((data) => {
                    if (data.length > 0) {
                        deletegateRecord = data[0];
                    }
                });
                if (!deletegateRecord) {
                    const returncode = "300";
                    const message = "Gate you want to delete is not registered";
                    var data;
                    return { returncode, message, data };
                }
                var result;
                yield this.gateListModel.services
                    .update(update, {
                    where: filter,
                })
                    .then((data) => {
                    if (data == 1) {
                        result = { returncode: "200", message: 'Gate Deleted successfully!' };
                    }
                    else {
                        result = { returncode: "300", message: 'Error deleting gate' };
                    }
                });
                return result;
            }
            catch (e) {
                throw e;
            }
        });
    }
    updateGate(req) {
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
                const filter = { gate_id: req.body.gate_id };
                const update = {
                    userid: req.body.userid,
                    gate_name: req.body.gate_name,
                    gate_location: req.body.location,
                    remark: req.body.remark,
                    gate_isdeleted: req.body.gate_isdeleted
                };
                try {
                    var result;
                    // Mysql function to update data
                    yield this.gateListModel.services
                        .update(update, {
                        where: filter,
                    })
                        .then((data) => {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Gate updated successfully!' };
                        }
                        else {
                            result = { returncode: "300", message: 'Error updating Gate' };
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
    __param(0, (0, typedi_1.Inject)('gateListModel')),
    __param(1, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object, Object])
], AuthService);
exports.default = AuthService;
