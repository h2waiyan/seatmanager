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
const route_1 = __importDefault(require("../../services/route"));
const middlewares_1 = __importDefault(require("../middlewares"));
const celebrate_1 = require("celebrate");
const route = (0, express_1.Router)();
var CreateRouteSchema = celebrate_1.Joi.object().keys({
    userid: celebrate_1.Joi.string().required(),
    gate_id: celebrate_1.Joi.string().required(),
    route_name: celebrate_1.Joi.string().required(),
    remark: celebrate_1.Joi.string().allow(""),
    route_isdeleted: celebrate_1.Joi.boolean()
});
var DeleteRouteSchema = celebrate_1.Joi.object().keys({
    userid: celebrate_1.Joi.string().required(),
    route_id: celebrate_1.Joi.string().required(),
});
exports.default = (app) => {
    app.use('/route', route);
    //Sign up
    route.post('/create', middlewares_1.default.validation(CreateRouteSchema), middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const routeServiceInstance = typedi_1.Container.get(route_1.default);
            const { returncode, message } = yield routeServiceInstance.CreateRoute(req.body);
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
            const routeServiceInstance = typedi_1.Container.get(route_1.default);
            const { returncode, message, data } = yield routeServiceInstance.GetAllRoutes(req);
            return res.json({ returncode, message, data }).status(200);
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/getwithgate', 
    // middlewares.validation(),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const routeServiceInstance = typedi_1.Container.get(route_1.default);
            const { returncode, message, data } = yield routeServiceInstance.GetWithGate(req);
            return res.json({ returncode, message, data }).status(200);
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/delete', middlewares_1.default.validation(DeleteRouteSchema), 
    // middlewares.isAuth,
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const routeServiceInstance = typedi_1.Container.get(route_1.default);
            const { returncode, message, data } = yield routeServiceInstance.DeleteRoute(req);
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
            const routeServiceInstance = typedi_1.Container.get(route_1.default);
            const { returncode, message } = yield routeServiceInstance.updateRoute(req);
            return res.json({ returncode, message }).status(200);
        }
        catch (e) {
            return next(e);
        }
    }));
};
