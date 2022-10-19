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
const express_1 = require("express");
const typedi_1 = require("typedi");
const seat_1 = __importDefault(require("../../services/seat"));
const middlewares_1 = __importDefault(require("../middlewares"));
const celebrate_1 = require("celebrate");
const route = (0, express_1.Router)();
var SeatCreateSchema = celebrate_1.Joi.object().keys({
    userid: celebrate_1.Joi.string().required(),
    seat_id: celebrate_1.Joi.array().allow(""),
    seat_no_array: celebrate_1.Joi.array().required(),
    trip_id: celebrate_1.Joi.string().required(),
    sub_route_id: celebrate_1.Joi.string().allow(""),
    seat_status: celebrate_1.Joi.number().required(),
    car_type: celebrate_1.Joi.string().allow(""),
    original_price: celebrate_1.Joi.number().required(),
    seat_and_status: celebrate_1.Joi.any().required(),
    total_price: celebrate_1.Joi.number().allow(""),
    customer_name: celebrate_1.Joi.string().allow(""),
    discount: celebrate_1.Joi.number().allow(""),
    phone: celebrate_1.Joi.string().allow(""),
    gender: celebrate_1.Joi.number().allow(""),
    pickup_place: celebrate_1.Joi.string().allow(""),
    remark: celebrate_1.Joi.string().allow(""),
    seat_isdeleted: celebrate_1.Joi.boolean(),
});
var GetSeatsSchema = celebrate_1.Joi.object().keys({
    userid: celebrate_1.Joi.string().required(),
    trip_id: celebrate_1.Joi.string().allow(""),
});
var EditSeatsSchema = celebrate_1.Joi.object().keys({
    userid: celebrate_1.Joi.string().required(),
    seat_id: celebrate_1.Joi.array().required(),
    seat_no_array: celebrate_1.Joi.array(),
    trip_id: celebrate_1.Joi.string().required(),
    sub_route_id: celebrate_1.Joi.string().allow(""),
    seat_status: celebrate_1.Joi.number().required(),
    car_type: celebrate_1.Joi.string().allow(""),
    original_price: celebrate_1.Joi.number().required(),
    seat_and_status: celebrate_1.Joi.any().required(),
    total_price: celebrate_1.Joi.number().allow(""),
    customer_name: celebrate_1.Joi.string().allow(""),
    discount: celebrate_1.Joi.number().allow(""),
    phone: celebrate_1.Joi.string().allow(""),
    gender: celebrate_1.Joi.number().allow(""),
    pickup_place: celebrate_1.Joi.string().allow(""),
    remark: celebrate_1.Joi.string().allow(""),
    seat_isdeleted: celebrate_1.Joi.boolean(),
});
exports.default = (app) => {
    app.use('/seats', route);
    route.post('/create', middlewares_1.default.validation(SeatCreateSchema), middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authServiceInstance = typedi_1.Container.get(seat_1.default);
            const { returncode, message } = yield authServiceInstance.CreateSeat(req.body);
            return res.status(200).json({ returncode, message });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/get', middlewares_1.default.validation(GetSeatsSchema), middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const SeatServiceInstance = typedi_1.Container.get(seat_1.default);
            const { returncode, message, data } = yield SeatServiceInstance.GetSeats(req.body);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/edit', middlewares_1.default.validation(EditSeatsSchema), middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const SeatServiceInstance = typedi_1.Container.get(seat_1.default);
            const { returncode, message, data } = yield SeatServiceInstance.EditSeat(req.body);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            return next(e);
        }
    }));
};
