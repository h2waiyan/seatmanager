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
    const tripModel = {
        name: 'tripModel',
        model: require('../models/trip'),
    };
    const seatModel = {
        name: 'seatModel',
        model: require('../models/seat'),
    };
    const cartypeModel = {
        name: 'cartypeModel',
        model: require('../models/car_type'),
    };
    const hashedPassword = yield argon2_1.default.hash('TastySoft@091');
    userModel.model.sequelize.sync().then(function () {
        userModel.model.services.findAll({}).then((data) => {
            const systemadmindata = [
                {
                    userid: "09761315566",
                    username: 'admin',
                    usertype: "1",
                    password: hashedPassword
                },
                {
                    userid: "09258259091",
                    username: 'admin',
                    usertype: "1",
                    password: hashedPassword
                }
            ];
            if (data.length == 0) {
                userModel.model.services.create(systemadmindata);
            }
        });
    });
    cartypeModel.model.sequelize.sync().then(function () {
        cartypeModel.model.services.findAll({}).then((data) => {
            const van = {
                car_type_id: "1",
                car_type_name: "Van",
                no_of_seats: 7,
                remark: "",
                car_type_isdeleted: false,
                userid: "09258259091"
            };
            const Noah7 = {
                car_type_id: "2",
                car_type_name: "Noah7",
                no_of_seats: 7,
                remark: "",
                car_type_isdeleted: false,
                userid: "09258259091"
            };
            if (data.length == 0) {
                cartypeModel.model.services.create(van);
                cartypeModel.model.services.create(Noah7);
            }
        });
    });
    // Set Containers for Dependency Injection
    yield (0, dependencyInjector_1.default)({
        models: [
            userModel,
            tripModel,
            seatModel,
            cartypeModel
        ],
    });
    yield (0, express_1.default)({ app: expressApp });
});
