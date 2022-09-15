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
const validation_1 = __importDefault(require("../../services/validation"));
const celebrate_1 = require("celebrate");
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/auth', route);
    //Sign up
    route.post('/createuser', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            userid: celebrate_1.Joi.string().required(),
            usertype: celebrate_1.Joi.number().required(),
            username: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required(),
            // gate_id: Joi.string().required(),
            // service_fee_id: Joi.string().required(),
            // isdeleted: Joi.string().required(),
            sessionexpired: celebrate_1.Joi.string().required(),
        }),
    }), middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            // if (ValidationServiceInstance.createUserRequest(req) == 'incorrectfield') {
            //   return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            // }
            // if (ValidationServiceInstance.createUserRequest(req) == 'blankfield') {
            //   return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            // }
            const authServiceInstance = typedi_1.Container.get(auth_1.default);
            const { returncode, message } = yield authServiceInstance.CreateUser(req.body);
            return res.status(200).json({ returncode, message });
        }
        catch (e) {
            return next(e);
        }
    }));
    // Sign in
    route.post('/signin', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.signinrequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.signinrequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
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
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.refreshTokenRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.refreshTokenRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const authServiceInstance = typedi_1.Container.get(auth_1.default);
            const { returncode, message, data, token } = yield authServiceInstance.RefreshToken(req);
            return res.json({ returncode, message, data, token }).status(200);
        }
        catch (e) {
            return next(e);
        }
    }));
};
