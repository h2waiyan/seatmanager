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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const argon2_1 = __importDefault(require("argon2"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
let AuthService = class AuthService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    CreateUser(IUser) {
        return __awaiter(this, void 0, void 0, function* () {
            var adminuserCheck;
            yield this.userModel.services.findAll({ where: { userid: IUser.userid, isdeleted: false } }).then((data) => {
                if (data.length > 0) {
                    adminuserCheck = data[0];
                }
            });
            if (!adminuserCheck) {
                return { returncode: "300", message: "User Not Found" };
            }
            if (adminuserCheck.usertype == 3) {
                return { returncode: "300", message: "User has no aurhorization to create new user." };
            }
            try {
                const hashedPassword = yield argon2_1.default.hash(IUser.password);
                const userData = {
                    // userid: IUser.userid,
                    userid: IUser.createuserid,
                    username: IUser.username,
                    password: hashedPassword,
                    usertype: IUser.usertype,
                    remark: IUser.remark,
                    service_fee_id: IUser.service_fee_id,
                    gate_id: IUser.gate_id,
                };
                var userCheck;
                yield this.userModel.services.findAll({
                    where: {
                        userid: IUser.createuserid,
                        isdeleted: false
                    }
                }).then((data) => {
                    if (data.length > 0) {
                        userCheck = data[0];
                    }
                });
                if (userCheck) {
                    return { returncode: "300", message: "User Already Registered" };
                }
                var deleteduserCheck;
                yield this.userModel.services.findAll({
                    where: {
                        userid: IUser.createuserid,
                        isdeleted: true
                    }
                }).then((data) => {
                    if (data.length > 0) {
                        deleteduserCheck = data[0];
                    }
                });
                if (deleteduserCheck) {
                    return {
                        returncode: "500",
                        message: "User Already Registered and want to reactivate account again?"
                    };
                }
                var userRecord;
                yield this.userModel.services.create(userData).then((data) => {
                    userRecord = data;
                });
                return { returncode: "200", message: "Success" };
            }
            catch (e) {
                console.log(e);
                return { returncode: "300", message: "Fail" };
            }
        });
    }
    SignIn(UserLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            var userRecord;
            yield this.userModel.services.findAll({ where: { userid: UserLogin.userid, isdeleted: false } }).then((data) => {
                if (data.length > 0) {
                    userRecord = data[0];
                }
            });
            if (!userRecord) {
                return { returncode: "300", message: "User Not Registered" };
            }
            const validPassword = yield argon2_1.default.verify(userRecord.password, UserLogin.password);
            if (validPassword) {
                // update session expired to false
                yield this.userModel.services
                    .update({ sessionexpired: false }, {
                    where: { userid: UserLogin.userid, isdeleted: false }
                })
                    .then((data) => {
                    if (data == 1) {
                        console.log("session updated ----------");
                    }
                    else {
                        console.log("error in updating session ---->");
                    }
                });
                const token = this.generateToken(userRecord);
                const data = {
                    "userid": userRecord.userid,
                    "usertype": userRecord.usertype,
                    "username": userRecord.username,
                    "remark": userRecord.remark,
                    "gateid": userRecord.gate_id
                };
                if (UserLogin.fcmtoken == undefined || "") {
                    return { returncode: "200", message: "Success", data, token };
                }
                try {
                    const noti_device_id = "noti_device_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                    const notiDeviceData = Object.assign({ noti_device_id }, UserLogin);
                    var dataCheck;
                    // await this.noti_deviceModel.services.findAll(
                    //   { where: { userid: UserLogin.userid, uuid: UserLogin.uuid } }
                    // ).then((data: any) => {
                    //   if (data.length > 0) {
                    //     dataCheck = data[0];
                    //   }
                    // });
                    if (!dataCheck) {
                        var newRecord;
                        // await this.noti_deviceModel.services.create(notiDeviceData).then(
                        //   (data: any) => {
                        //     newRecord = data
                        //   }
                        // )
                        return { returncode: "200", message: "Success", data, token };
                    }
                    if (dataCheck) {
                        try {
                            var filter = { userid: UserLogin.userid, uuid: UserLogin.uuid };
                            var update = {
                                userid: UserLogin.userid,
                                uuid: UserLogin.uuid,
                                fcmtoken: UserLogin.fcmtoken
                            };
                            console.log(update);
                            // await this.noti_deviceModel.services
                            //   .update(update, {
                            //     where: filter,
                            //   }).then((data: any) => {
                            //     if (data) {
                            //       if (data == 1) {
                            //         return { returncode: "200", message: "Success", data, token };
                            //       } else {
                            //         return { returncode: "300", message: "Fail" };
                            //       }
                            //     }
                            //   });
                        }
                        catch (e) {
                            return { returncode: "300", message: "error" };
                        }
                    }
                }
                catch (e) {
                    return { returncode: "300", message: "fail" };
                }
                return { returncode: "200", message: "Success", data, token };
            }
            else {
                return { returncode: "300", message: "Invalid Password" };
            }
        });
    }
    //refresh token -> useid, token
    RefreshToken(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var token = req.body.token;
            try {
                var decodedToken = (0, jwt_decode_1.default)(token);
                var useridfromtoken = decodedToken.userid;
                var exp = decodedToken.exp;
            }
            catch (e) {
                return { returncode: "300", message: "Invalid Token" };
            }
            if (req.body.userid != useridfromtoken) {
                return { returncode: "300", message: "Unauthorized User" };
            }
            if (Date.now() >= exp * 1000) {
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: useridfromtoken, isdeleted: false } }).then((data) => {
                    if (data.length > 0) {
                        userRecord = data[0];
                    }
                });
                if (!userRecord) {
                    return { returncode: "300", message: "User Not Registered" };
                }
                else {
                    const token = this.generateToken(userRecord);
                    const data = {};
                    return { returncode: "200", message: "Successfully generated token", data, token };
                    // return { user, token };
                }
            }
            else {
                var data;
                return { returncode: "200", message: "Token is valid", data, token };
            }
        });
    }
    generateToken(user) {
        return jsonwebtoken_1.default.sign({
            userid: user.userid,
        }, config_1.default.jwtSecret, {
            expiresIn: "1d",
        });
    }
};
AuthService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object])
], AuthService);
exports.default = AuthService;
