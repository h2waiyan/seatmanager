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
    constructor(keywordModel, userModel) {
        this.keywordModel = keywordModel;
        this.userModel = userModel;
    }
    // user create -> userid, category_id, category_type, category_name, category_remark
    CreateKeyword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.adminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "User Not Found" };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User has no authorization to create keyword." };
            }
            try {
                const keyword_id = "keyword_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
                const keywordData = Object.assign({ keyword_id }, req.body);
                var dataCheck;
                yield this.keywordModel.services.findAll({
                    where: { keyword_id: keyword_id, keyword_isdeleted: false }
                }).then((data) => {
                    if (data.length > 0) {
                        dataCheck = data[0];
                    }
                });
                if (dataCheck) {
                    const returncode = "300";
                    const message = "Keyword ID already exists. Try agian.";
                    return { returncode, message };
                }
                var newRecord;
                yield this.keywordModel.services.create(keywordData).then((data) => {
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
    GetKeywords(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.userCheck(req);
            if (userRecord == "user-not-found") {
                return { returncode: "300", message: "User Not Found", data: {} };
            }
            const Op = sequelize_1.default.Op;
            try {
                try {
                    var result;
                    yield this.keywordModel.services.findAll({ where: { keyword_isdeleted: false } }).then((data) => {
                        if (data) {
                            const returncode = "200";
                            const message = "Keyword List";
                            var templist = [];
                            data.map((item) => {
                                var tempitem = {
                                    keyword_id: item.keyword_id,
                                    keyword_icon: item.keyword_icon,
                                    keyword_name: item.keyword_name,
                                    keyword_iconplusname: item.keyword_icon + " " + item.keyword_name
                                };
                                templist.push(tempitem);
                            });
                            result = { returncode, message, data: templist };
                        }
                        else {
                            const returncode = "300";
                            const message = "Keyword list not found";
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
    EditKeyword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthrizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthrizationCheckService.adminCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "User Not Found" };
            }
            if (userRecord == "user-has-no-authorization") {
                return { returncode: "300", message: "User Had no authorization to edit keyword." };
            }
            const Op = sequelize_1.default.Op;
            try {
                var result;
                var filter = { keyword_id: req.body.keyword_id, keyword_isdeleted: false };
                var update = {
                    keyword_icon: req.body.keyword_icon,
                    keyword_name: req.body.keyword_name,
                    keyword_isdeleted: req.body.keyword_isdeleted
                };
                yield this.keywordModel.services
                    .update(update, {
                    where: filter,
                }).then((data) => {
                    if (data) {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Keyword Updated successfully' };
                        }
                        else {
                            result = { returncode: "300", message: 'Error upading or deleting Keyword' };
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
    __param(0, (0, typedi_1.Inject)('keywordModel')),
    __param(1, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object, Object])
], CategoryService);
exports.default = CategoryService;
