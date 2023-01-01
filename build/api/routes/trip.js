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
const trip_1 = __importDefault(require("../../services/trip"));
const middlewares_1 = __importDefault(require("../middlewares"));
const celebrate_1 = require("celebrate");
const route = (0, express_1.Router)();
var TripCreateScehma = celebrate_1.Joi.object().keys({
    userid: celebrate_1.Joi.string().required(),
    trip_id: celebrate_1.Joi.string().allow(""),
    gate_id: celebrate_1.Joi.string().required(),
    date: celebrate_1.Joi.array().required(),
    route_id: celebrate_1.Joi.array().required(),
    car_type_id: celebrate_1.Joi.array().required(),
    seat_and_status: celebrate_1.Joi.string().allow(""),
    car_id: celebrate_1.Joi.string().allow(""),
    total_price: celebrate_1.Joi.number().allow(""),
    remark: celebrate_1.Joi.string().allow(""),
    trip_isdeleted: celebrate_1.Joi.boolean(),
});
var GetTripSchema = celebrate_1.Joi.object().keys({
    userid: celebrate_1.Joi.string().required(),
    gate_id: celebrate_1.Joi.string().required(),
    date: celebrate_1.Joi.string().required(),
    route_id: celebrate_1.Joi.string().required(),
});
var DeleteOneTripSchema = celebrate_1.Joi.object().keys({
    userid: celebrate_1.Joi.string().required(),
    trip_id: celebrate_1.Joi.string().required(),
});
var EditOneTripSchema = celebrate_1.Joi.object().keys({
    userid: celebrate_1.Joi.string().required(),
    trip_id: celebrate_1.Joi.string().required(),
    gate_id: celebrate_1.Joi.string().required(),
    date: celebrate_1.Joi.string().required(),
    route_id: celebrate_1.Joi.string().required(),
    car_type_id: celebrate_1.Joi.string().required(),
    seat_and_status: celebrate_1.Joi.string().allow(""),
    car_id: celebrate_1.Joi.string().allow(""),
    total_price: celebrate_1.Joi.number().allow(""),
    remark: celebrate_1.Joi.string().allow(""),
    trip_isdeleted: celebrate_1.Joi.boolean(),
});
exports.default = (app) => {
    app.use('/trips', route);
    //Sign up
    route.post('/create', middlewares_1.default.validation(TripCreateScehma), middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authServiceInstance = typedi_1.Container.get(trip_1.default);
            const { returncode, message } = yield authServiceInstance.CreateTrip(req.body);
            return res.status(200).json({ returncode, message });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/get', middlewares_1.default.validation(GetTripSchema), middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authServiceInstance = typedi_1.Container.get(trip_1.default);
            const { returncode, message, data } = yield authServiceInstance.GetTrips(req.body);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/single_delete', middlewares_1.default.validation(DeleteOneTripSchema), middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authServiceInstance = typedi_1.Container.get(trip_1.default);
            const { returncode, message, data } = yield authServiceInstance.DeleteTrip(req.body);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/single_edit', middlewares_1.default.validation(EditOneTripSchema), middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authServiceInstance = typedi_1.Container.get(trip_1.default);
            const { returncode, message, data } = yield authServiceInstance.editTrip(req.body);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            return next(e);
        }
    }));
};
