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
const typedi_2 = require("typedi");
const authorization_check_1 = __importDefault(require("./authorization_check"));
let CategoryService = class CategoryService {
    constructor(noti_deviceModel, userModel) {
        this.noti_deviceModel = noti_deviceModel;
        this.userModel = userModel;
    }
    DeleteNotiDevice(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var AuthroizationCheckService = typedi_2.Container.get(authorization_check_1.default);
            var userRecord = yield AuthroizationCheckService.userCheck(req);
            if (userRecord == "admin-not-found") {
                return { returncode: "300", message: "User Not Found" };
            }
            try {
                var dataCheck;
                yield this.noti_deviceModel.services.findAll({ where: { userid: req.body.userid, uuid: req.body.uuid } }).then((data) => {
                    if (data.length > 0) {
                        dataCheck = data[0];
                    }
                });
                if (!dataCheck) {
                    return { returncode: "300", message: "Noti Device Not Found" };
                }
                var newRecord;
                yield this.noti_deviceModel.services.destroy({ where: { userid: req.body.userid, uuid: req.body.uuid } }).then((data) => {
                    newRecord = data;
                });
                return { returncode: "200", message: "success" };
            }
            catch (e) {
                return { returncode: "300", message: "fail" };
            }
        });
    }
};
CategoryService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('noti_deviceModel')),
    __param(1, (0, typedi_1.Inject)('userModel')),
    __metadata("design:paramtypes", [Object, Object])
], CategoryService);
exports.default = CategoryService;
