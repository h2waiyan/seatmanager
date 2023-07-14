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
const subroute_1 = __importDefault(require("../../services/subroute"));
const middlewares_1 = __importDefault(require("../middlewares"));
const celebrate_1 = require("celebrate");
const route = (0, express_1.Router)();
var CreateSubrouteSchema = celebrate_1.Joi.object().keys({
    userid: celebrate_1.Joi.string().required(),
    route_id: celebrate_1.Joi.string().required(),
    subroute_name: celebrate_1.Joi.string().required(),
    cartype_id: celebrate_1.Joi.string().allow(""),
    front_seat_price: celebrate_1.Joi.number(),
    back_seat_price: celebrate_1.Joi.number(),
    remark: celebrate_1.Joi.string().allow(""),
    subroute_isdeleted: celebrate_1.Joi.boolean()
});
var DeleteSubrouteSchema = celebrate_1.Joi.object().keys({
    userid: celebrate_1.Joi.string().required(),
    subroute_id: celebrate_1.Joi.string().required(),
});
exports.default = (app) => {
    app.use('/subroute', route);
    //Sign up
    route.post('/create', middlewares_1.default.validation(CreateSubrouteSchema), middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const subrouteServiceInstance = typedi_1.Container.get(subroute_1.default);
            const { returncode, message } = yield subrouteServiceInstance.CreateSubRoute(req.body);
            return res.status(200).json({ returncode, message });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/getall', 
    // middlewares.validation(),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const subrouteServiceInstance = typedi_1.Container.get(subroute_1.default);
            const { returncode, message, data } = yield subrouteServiceInstance.GetAllSubRoutes(req);
            return res.json({ returncode, message, data }).status(200);
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/getwithrouteid', 
    // middlewares.validation(),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const subrouteServiceInstance = typedi_1.Container.get(subroute_1.default);
            const { returncode, message, data } = yield subrouteServiceInstance.GetWithRouteID(req);
            return res.json({ returncode, message, data }).status(200);
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/delete', middlewares_1.default.validation(DeleteSubrouteSchema), 
    // middlewares.isAuth,
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const subrouteServiceInstance = typedi_1.Container.get(subroute_1.default);
            const { returncode, message, data } = yield subrouteServiceInstance.DeleteSubroute(req);
            return res.json({ returncode, message, data }).status(200);
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/update', 
    // middlewares.validation(),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const subrouteServiceInstance = typedi_1.Container.get(subroute_1.default);
            const { returncode, message } = yield subrouteServiceInstance.updateSubroute(req);
            return res.json({ returncode, message }).status(200);
        }
        catch (e) {
            return next(e);
        }
    }));
};
