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
let CategoryService = class CategoryService {
    constructor(categoryModel, userModel) {
        this.categoryModel = categoryModel;
        this.userModel = userModel;
    }
    // user create -> userid, category_id, category_type, category_name, category_remark
    CreateCategory(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.rootAdminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "Admin Not Found" };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create Category." };
            }
            try {
                const category_id = "category_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                const categoryData = Object.assign({ category_id }, req.body);
                var dataCheck;
                yield this.categoryModel.services.findAll({
                    where: { category_id: category_id, category_isdeleted: false }
                }).then((data) => {
                    if (data.length > 0) {
                        dataCheck = data[0];
                    }
                });
                if (dataCheck) {
                    const returncode = "300";
                    const message = "Category ID already exists. Try agian.";
                    return { returncode, message };
                }
                var newRecord;
                yield this.categoryModel.services.create(categoryData).then((data) => {
                    newRecord = data;
                });
                return { returncode: "200", message: "success" };
            }
            catch (e) {
                return { returncode: "300", message: "fail" };
            }
        });
    }
    //to get category list -> userid, 
    getCategory(req) {
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
                if (userRecord.usertype == 1) {
                    try {
                        var result;
                        // Mysql function to delete dat{a
                        yield this.categoryModel.services.findAll({ where: { category_isdeleted: false } }).then((data) => {
                            if (data) {
                                const returncode = "200";
                                const message = "Category List";
                                var templist = [];
                                data.map((item) => {
                                    var tempitem = {
                                        category_id: item.category_id,
                                        category_type: item.category_type,
                                        category_icon: item.category_icon,
                                        category_name: item.category_name,
                                        category_iconplusname: item.category_icon + " " + item.category_name,
                                        category_remark: item.category_remark
                                    };
                                    templist.push(tempitem);
                                });
                                data = templist;
                                // return { returncode, message, data };
                                result = { returncode, message, data };
                            }
                            else {
                                const returncode = "300";
                                const message = "Category list not found";
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
                else {
                    try {
                        var result;
                        const filter = {
                            [Op.or]: [
                                { category_type: 2, category_isdeleted: false },
                                { category_type: 3, category_isdeleted: false },
                                { category_type: 4, category_isdeleted: false }
                            ],
                        };
                        // Mysql function to delete dat{a
                        yield this.categoryModel.services.findAll({ where: filter }).then((data) => {
                            if (data) {
                                var templist = [];
                                data.map((item) => {
                                    var tempitem = {
                                        category_id: item.category_id,
                                        category_type: item.category_type,
                                        category_icon: item.category_icon,
                                        category_name: item.category_name,
                                        category_iconplusname: item.category_icon + " " + item.category_name,
                                        category_remark: item.category_remark
                                    };
                                    templist.push(tempitem);
                                });
                                data = templist;
                                const returncode = "200";
                                const message = "Category List";
                                result = { returncode, message, data };
                            }
                            else {
                                const returncode = "300";
                                const message = "Category list not found";
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
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
    editCategory(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.rootAdminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "User Not Found" };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to create Category." };
            }
            const Op = sequelize_1.default.Op;
            try {
                var result;
                var filter = { category_id: req.body.category_id, category_isdeleted: false };
                var update = {
                    category_icon: req.body.category_icon,
                    category_name: req.body.category_name,
                    category_remark: req.body.category_remark,
                    category_isdeleted: req.body.category_isdeleted
                };
                yield this.categoryModel.services
                    .update(update, {
                    where: filter,
                }).then((data) => {
                    if (data) {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Category Updated successfully' };
                        }
                        else {
                            result = { returncode: "300", message: 'Error upading or deleting category' };
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
CategoryService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('categoryModel')),
    __param(1, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object, Object])
], CategoryService);
exports.default = CategoryService;
