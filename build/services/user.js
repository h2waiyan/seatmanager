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
const argon2_1 = __importDefault(require("argon2"));
const crypto_1 = require("crypto");
const sequelize_1 = __importDefault(require("sequelize"));
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    // to update password -> userid, password, newpassword
    updatePassword(req) {
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
                // if (userRecord.usertype == 3) {
                //   const returncode = "300";
                //   const message = "User has no authorization to reset password."
                //   var data: any;
                //   return { returncode, message, data };
                // }
                /**
                 * We use verify from argon2 to prevent 'timing based' attacks
                 */
                const validPassword = yield argon2_1.default.verify(userRecord.password, req.body.password);
                if (validPassword) {
                    const salt = (0, crypto_1.randomBytes)(32);
                    const hashedPassword = yield argon2_1.default.hash(req.body.newpassword);
                    const filter = { userid: req.body.userid };
                    const update = { password: hashedPassword };
                    try {
                        var result;
                        // Mysql function to update data
                        yield this.userModel.services
                            .update(update, {
                            where: filter,
                        })
                            .then((data) => {
                            if (data == 1) {
                                result = { returncode: "200", message: 'Password updated successfully!' };
                            }
                            else {
                                result = { returncode: "300", message: 'Error updating password' };
                            }
                        });
                        return result;
                    }
                    catch (e) {
                        throw e;
                    }
                }
                else {
                    return { returncode: "300", message: "Invalid Password" };
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    // to delete user -> userid, adminpassword, deleteuserid
    deleteUser(req) {
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
            const filter = { userid: req.body.deleteuserid, isdeleted: false };
            const update = { isdeleted: true };
            try {
                var deleteuserRecord;
                yield this.userModel.services.findAll({ where: filter }).then((data) => {
                    if (data.length > 0) {
                        deleteuserRecord = data[0];
                    }
                });
                if (!deleteuserRecord) {
                    const returncode = "300";
                    const message = "User you want to delete is not registered";
                    var data;
                    return { returncode, message, data };
                }
                if (userRecord.usertype != 1 && deleteuserRecord.usertype == 1) {
                    const returncode = "300";
                    const message = "Can't delete Root Admin";
                    var data;
                    return { returncode, message, data };
                }
                var result;
                yield this.userModel.services
                    .update(update, {
                    where: filter,
                })
                    .then((data) => {
                    if (data == 1) {
                        result = { returncode: "200", message: 'User Deleted successfully!' };
                    }
                    else {
                        result = { returncode: "300", message: 'Error deleting user' };
                    }
                });
                return result;
            }
            catch (e) {
                throw e;
            }
        });
    }
    // to activate deleteuser -> userid, password, deleteduserid,
    reactivateDeletedUser(req) {
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
                    const message = "Admin Not Registered";
                    var data;
                    return { returncode: "300", message, data };
                }
                if (userRecord.usertype == 3) {
                    const returncode = "300";
                    const message = "User has no authorization to activate user.";
                    var data;
                    return { returncode, message, data };
                }
                var deleteduserRecord;
                // Mysql function to find data
                // before updating the password, we need to check user is registered or not
                yield this.userModel.services.findAll({ where: { userid: req.body.deleteduserid, isdeleted: true } }).then((data) => {
                    if (data.length > 0) {
                        deleteduserRecord = data[0];
                    }
                });
                if (!deleteduserRecord) {
                    const returncode = "300";
                    const message = "User Not Found";
                    var data;
                    return { returncode, message, data };
                }
                /**
                 * We use verify from argon2 to prevent 'timing based' attacks
                 */
                const filter = { userid: req.body.deleteduserid, isdeleted: true };
                const update = { isdeleted: false };
                try {
                    var result;
                    // Mysql function to update data
                    yield this.userModel.services
                        .update(update, {
                        where: filter,
                    })
                        .then((data) => {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Activated user successfully!' };
                        }
                        else {
                            result = { returncode: "300", message: 'Error activating user' };
                        }
                    });
                    return result;
                }
                catch (e) {
                    throw e;
                }
                // else {
                //   const returncode = "300";
                //   const message = "Invalid Password"
                //   var data: any;
                //   return { returncode, message, data };
                // }
            }
            catch (e) {
                throw e;
            }
        });
    }
    // to change user password -> userid, changepwduserid, newpassword
    resetPassword(req) {
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
                    const message = "Admin Not Found";
                    var data;
                    return { returncode, message, data };
                }
                if (userRecord.usertype == 3) {
                    const returncode = "300";
                    const message = "User has no authorization to reset password.";
                    var data;
                    return { returncode, message, data };
                }
                var changepwduserRecord;
                yield this.userModel.services.findAll({ where: { userid: req.body.changepwduserid, isdeleted: false } }).then((data) => {
                    if (data.length > 0) {
                        changepwduserRecord = data[0];
                    }
                });
                if (!changepwduserRecord) {
                    const returncode = "300";
                    const message = "User Not Registered";
                    var data;
                    return { returncode, message, data };
                }
                if (userRecord.usertype != 1 && changepwduserRecord.usertype == 1) {
                    const returncode = "300";
                    const message = "Can't reset Root Admin's Password";
                    var data;
                    return { returncode, message, data };
                }
                /**
                 * We use verify from argon2 to prevent 'timing based' attacks
                 */
                const salt = (0, crypto_1.randomBytes)(32);
                const hashedPassword = yield argon2_1.default.hash(req.body.newpassword);
                const filter = { userid: req.body.changepwduserid };
                const update = { password: hashedPassword, sessionexpired: true };
                try {
                    var result;
                    // Mysql function to update data
                    yield this.userModel.services
                        .update(update, {
                        where: filter,
                    })
                        .then((data) => {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Password reseted successfully!' };
                        }
                        else {
                            result = { returncode: "300", message: 'Error reseting password' };
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
    // to get users -> userid
    getusers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const Op = sequelize_1.default.Op;
            try {
                var userRecord;
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
                    if (userRecord.usertype == 1 || userRecord.usertype == 2) {
                        try {
                            var result;
                            const filter = {
                                [Op.or]: [{ usertype: 2, isdeleted: false }, { usertype: 3, isdeleted: false }],
                            };
                            // Mysql function to delete dat{a
                            yield this.userModel.services.findAll({ where: filter }).then((data) => {
                                if (data) {
                                    const returncode = "200";
                                    const message = "User List";
                                    var templist = [];
                                    data.map((item) => {
                                        if (item.userid != req.body.userid) {
                                            var tempitem = {
                                                userid: item.userid,
                                                usertype: item.usertype,
                                                username: item.username,
                                                remark: item.remark
                                            };
                                            templist.push(tempitem);
                                        }
                                    });
                                    data = templist;
                                    // return { returncode, message, data };
                                    result = { returncode, message, data };
                                }
                                else {
                                    const returncode = "300";
                                    const message = "User list not found";
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
                    else {
                        const returncode = "300";
                        const message = "User has no authorization to get all users.";
                        var data;
                        return { returncode, message, data };
                    }
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    // to get userdetails -> userid
    getuserdetails(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const Op = sequelize_1.default.Op;
            try {
                var adminuserRecord;
                yield this.userModel.services.findAll({ where: { userid: req.body.userid } }).then((data) => {
                    if (data.length > 0) {
                        adminuserRecord = data[0];
                    }
                });
                if (!adminuserRecord) {
                    const returncode = "300";
                    const message = "Admin Not Found";
                    var data;
                    return { returncode, message, data };
                }
                try {
                    var userRecord;
                    var result;
                    const filter = { userid: req.body.detailsuserid, isdeleted: false };
                    yield this.userModel.services.findAll({ where: filter }).then((data) => {
                        if (data) {
                            const returncode = "200";
                            const message = "User Details";
                            const mydata = {
                                "userid": data[0].userid,
                                "usertype": data[0].usertype,
                                "username": data[0].username,
                                "remark": data[0].remark
                            };
                            result = { returncode, message, data: mydata };
                        }
                        else {
                            const returncode = "300";
                            const message = "User not found";
                            var data;
                            result = { returncode, message, data };
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
    // to edit user details -> userid, ...
    EditUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const Op = sequelize_1.default.Op;
            try {
                var adminuserRecord;
                // Mysql function to find data
                // before updating the password, we need to check user is registered or not
                yield this.userModel.services.findAll({ where: { userid: req.body.userid } }).then((data) => {
                    if (data.length > 0) {
                        adminuserRecord = data[0];
                    }
                });
                if (!adminuserRecord) {
                    const returncode = "300";
                    const message = "Admin Not Registered";
                    var data;
                    return { returncode, message, data };
                }
                if (adminuserRecord.usertype == 3) {
                    const returncode = "300";
                    const message = "User has no authorization to edit.";
                    var data;
                    return { returncode, message, data };
                }
                var userRecord;
                yield this.userModel.services.findAll({ where: { userid: req.body.edituserid } }).then((data) => {
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
                    if (adminuserRecord.usertype != 1 && req.body.usertype == '1') {
                        const returncode = "300";
                        const message = "Can't make changes to Root Admin";
                        var data;
                        result = { returncode, message, data };
                        return result;
                    }
                    var result;
                    const filter = { userid: req.body.edituserid };
                    const update = {
                        usertype: req.body.usertype,
                        username: req.body.username,
                        remark: req.body.remark
                    };
                    // Mysql function to delete dat{a
                    yield this.userModel.services
                        .update(update, {
                        where: filter,
                        returning: true,
                    }).then((data) => {
                        var newRecord = data[1];
                        if (newRecord) {
                            const returncode = "200";
                            const message = "User Edited";
                            const data = {
                                "userid": newRecord[0].userid,
                                "usertype": newRecord[0].usertype,
                                "username": newRecord[0].username,
                                "remark": newRecord[0].remark
                            };
                            result = { returncode, message, data };
                        }
                        else {
                            const returncode = "300";
                            const message = "User not found";
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
            catch (e) {
                throw e;
            }
        });
    }
};
UserService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object])
], UserService);
exports.default = UserService;
