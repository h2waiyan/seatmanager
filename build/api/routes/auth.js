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
const auth_1 = __importDefault(require("../../services/auth"));
const middlewares_1 = __importDefault(require("../middlewares"));
const celebrate_1 = require("celebrate");
const route = (0, express_1.Router)();
var CreateUserSchema = celebrate_1.Joi.object().keys({
    userid: celebrate_1.Joi.string().required(),
    usertype: celebrate_1.Joi.number().required(),
    username: celebrate_1.Joi.string().required(),
    password: celebrate_1.Joi.string().required(),
    gate_id: celebrate_1.Joi.string().allow(""),
    service_fee_id: celebrate_1.Joi.number().allow(""),
    remark: celebrate_1.Joi.string().allow(""),
    createuserid: celebrate_1.Joi.string().required(),
});
var SignInSchema = celebrate_1.Joi.object().keys({
    userid: celebrate_1.Joi.string().required(),
    password: celebrate_1.Joi.string().required(),
    uuid: celebrate_1.Joi.string(),
    fcmtoken: celebrate_1.Joi.string()
});
exports.default = (app) => {
    app.use('/auth', route);
    //Sign up
    route.post('/createuser', middlewares_1.default.validation(CreateUserSchema), middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authServiceInstance = typedi_1.Container.get(auth_1.default);
            const { returncode, message } = yield authServiceInstance.CreateUser(req.body);
            return res.status(200).json({ returncode, message });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/signin', middlewares_1.default.validation(SignInSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authServiceInstance = typedi_1.Container.get(auth_1.default);
            const { returncode, message, data, token } = yield authServiceInstance.SignIn(req.body);
            return res.json({ returncode, message, data, token }).status(200);
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/refreshtoken', 
    // middlewares.isAuth,
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authServiceInstance = typedi_1.Container.get(auth_1.default);
            const { returncode, message, data, token } = yield authServiceInstance.RefreshToken(req);
            return res.json({ returncode, message, data, token }).status(200);
        }
        catch (e) {
            return next(e);
        }
    }));
};
