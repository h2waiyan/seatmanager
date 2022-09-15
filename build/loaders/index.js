"use strict";
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
const express_1 = __importDefault(require("./express"));
const dependencyInjector_1 = __importDefault(require("./dependencyInjector"));
const argon2_1 = __importDefault(require("argon2"));
exports.default = ({ expressApp }) => __awaiter(void 0, void 0, void 0, function* () {
    const userModel = {
        name: 'userModel',
        model: require('../models/user'),
    };
    const hashedPassword = yield argon2_1.default.hash('admin');
    // create table
    // userModel.model.sequelize.sync();
    userModel.model.sequelize.sync().then(function () {
        userModel.model.services.findAll({}).then((data) => {
            const systemadmindata = {
                userid: "09258259091",
                username: 'admin',
                usertype: "1",
                password: hashedPassword
            };
            const heingpadmin = {
                userid: "09761315566",
                username: 'admin',
                usertype: "1",
                password: hashedPassword
            };
            if (data.length == 0) {
                userModel.model.services.create(systemadmindata);
                userModel.model.services.create(heingpadmin);
            }
        });
    });
    // Set Containers for Dependency Injection
    yield (0, dependencyInjector_1.default)({
        models: [
            userModel,
        ],
    });
    yield (0, express_1.default)({ app: expressApp });
});
