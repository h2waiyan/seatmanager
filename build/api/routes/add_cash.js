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
const add_cash_1 = __importDefault(require("../../services/add_cash"));
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/addcash', route);
    //Sign up
    route.post('/create', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const ValidationServiceInstance = Container.get(ValidationService);
            // if (ValidationServiceInstance.CreateDebtRequest(req) == 'incorrectfield') {
            //     return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            // }
            // if (ValidationServiceInstance.CreateDebtRequest(req) == 'blankfield') {
            //     return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            // }
            const AddCashServiceInstance = typedi_1.Container.get(add_cash_1.default);
            const { returncode, message } = yield AddCashServiceInstance.Createadd_cash(req);
            return res.status(200).json({ returncode, message });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/get', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const ValidationServiceInstance = Container.get(ValidationService);
            // if (ValidationServiceInstance.getCategoryRequest(req) == 'incorrectfield') {
            //     return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            // }
            // if (ValidationServiceInstance.getCategoryRequest(req) == 'blankfield') {
            //     return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            // }
            const AddCashServiceInstance = typedi_1.Container.get(add_cash_1.default);
            const { returncode, message, data } = yield AddCashServiceInstance.GetAddCashList(req);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/edit', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const ValidationServiceInstance = Container.get(ValidationService);
            // if (ValidationServiceInstance.EditDebtRequest(req) == 'incorrectfield') {
            //     return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            // }
            // if (ValidationServiceInstance.EditDebtRequest(req) == 'blankfield') {
            //     return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            // }
            const AddCashServiceInstance = typedi_1.Container.get(add_cash_1.default);
            const { returncode, message } = yield AddCashServiceInstance.EditAddCash(req);
            return res.status(200).json({ returncode, message });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/filter', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const ValidationServiceInstance = Container.get(ValidationService);
            // if (ValidationServiceInstance.EditDebtRequest(req) == 'incorrectfield') {
            //     return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            // }
            // if (ValidationServiceInstance.EditDebtRequest(req) == 'blankfield') {
            //     return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            // }
            const AddCashServiceInstance = typedi_1.Container.get(add_cash_1.default);
            const { returncode, message, data } = yield AddCashServiceInstance.AddCashFilter(req);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            return next(e);
        }
    }));
};
