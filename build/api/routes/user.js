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
const middlewares_1 = __importDefault(require("../middlewares"));
const user_1 = __importDefault(require("../../services/user"));
const validation_1 = __importDefault(require("../../services/validation"));
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/user', route);
    route.get('/test', (req, res, next) => {
        return res.status(200).json({ returncode: 200, message: "OKKKKK" });
    }),
        //Reset Password
        route.post('/updatepassword', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
                if (ValidationServiceInstance.changePwdRequest(req) == 'incorrectfield') {
                    return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
                }
                if (ValidationServiceInstance.changePwdRequest(req) == 'blankfield') {
                    return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
                }
                const authServiceInstance = typedi_1.Container.get(user_1.default);
                const { returncode, message } = yield authServiceInstance.updatePassword(req);
                return res.status(200).json({ returncode, message });
            }
            catch (e) {
                const returncode = "300";
                const message = "fail";
                return next({ returncode, message, e });
            }
        }));
    route.post('/delete', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.deleteUserRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.deleteUserRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const authServiceInstance = typedi_1.Container.get(user_1.default);
            const { returncode, message, data } = yield authServiceInstance.deleteUser(req);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            const returncode = "300";
            const message = "fail";
            return next({ returncode, message, e });
        }
    }));
    route.post('/reactivate', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.reactivateUserRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.reactivateUserRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const authServiceInstance = typedi_1.Container.get(user_1.default);
            const { returncode, message, data } = yield authServiceInstance.reactivateDeletedUser(req);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            const returncode = "300";
            const message = "fail";
            return next({ returncode, message, e });
        }
    }));
    route.post('/resetpassword', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.resetUserPwdRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.resetUserPwdRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const authServiceInstance = typedi_1.Container.get(user_1.default);
            const { returncode, message, data } = yield authServiceInstance.resetPassword(req);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            const returncode = "300";
            const message = "fail";
            return next({ returncode, message, e });
        }
    }));
    route.post('/getusers', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.getUserRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.getUserRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const authServiceInstance = typedi_1.Container.get(user_1.default);
            const { returncode, message, data } = yield authServiceInstance.getusers(req);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            const returncode = "300";
            const message = "fail";
            return next({ returncode, message, e });
        }
    }));
    route.post('/getuserdetails', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.getUserDetailsRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.getUserDetailsRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const authServiceInstance = typedi_1.Container.get(user_1.default);
            const { returncode, message, data } = yield authServiceInstance.getuserdetails(req);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            const returncode = "300";
            const message = "fail";
            return next({ returncode, message, e });
        }
    }));
    route.post('/edituser', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.editRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.editRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const authServiceInstance = typedi_1.Container.get(user_1.default);
            const { returncode, message, data } = yield authServiceInstance.EditUser(req);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            const returncode = "300";
            const message = "fail";
            return next({ returncode, message, e });
        }
    }));
};
