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
const balance_1 = __importDefault(require("../../services/balance"));
const validation_1 = __importDefault(require("../../services/validation"));
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/balance', route);
    //Sign up
    route.post('/create', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.CreateBalanceRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.CreateBalanceRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const BalanceServiceInstance = typedi_1.Container.get(balance_1.default);
            const { returncode, message } = yield BalanceServiceInstance.CreateBalance(req);
            return res.status(200).json({ returncode, message });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/today', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.GetTodayUserBalanceRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.GetTodayUserBalanceRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const BalanceServiceInstance = typedi_1.Container.get(balance_1.default);
            const { returncode, message, todayBalance, todayIncome, todayOutcome, data } = yield BalanceServiceInstance.GetTodayBalance(req);
            return res.status(200).json({ returncode, message, todayBalance, todayIncome, todayOutcome, data });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/dashboard', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.GetDashboardBalanceRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.GetDashboardBalanceRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const BalanceServiceInstance = typedi_1.Container.get(balance_1.default);
            const { returncode, message, dashboardData } = yield BalanceServiceInstance.TotalDashboardBalance(req);
            return res.status(200).json({ returncode, message, dashboardData });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/cardashboard', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.GetDashboardBalanceRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.GetDashboardBalanceRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const BalanceServiceInstance = typedi_1.Container.get(balance_1.default);
            const { returncode, message, dashboardData } = yield BalanceServiceInstance.CarDashboardBalance(req);
            return res.status(200).json({ returncode, message, dashboardData });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/gatedashboard', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.GetDashboardBalanceRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.GetDashboardBalanceRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const BalanceServiceInstance = typedi_1.Container.get(balance_1.default);
            const { returncode, message, dashboardData } = yield BalanceServiceInstance.GateDashboardBalance(req);
            return res.status(200).json({ returncode, message, dashboardData });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/filter', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.BalanceFilterRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.BalanceFilterRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const BalanceServiceInstance = typedi_1.Container.get(balance_1.default);
            const { returncode, message, dateList, totalBalance, sumIncome, sumOutcome, requestedRows, data } = yield BalanceServiceInstance.GetBalanceWithDateRange(req);
            return res.status(200).json({ returncode, message, dateList, totalBalance, sumIncome, sumOutcome, requestedRows, data });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/sevenrows', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.NextSevenRowsRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.NextSevenRowsRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const BalanceServiceInstance = typedi_1.Container.get(balance_1.default);
            const { returncode, message, dateList, data } = yield BalanceServiceInstance.GetBalanceForSevenRows(req);
            return res.status(200).json({ returncode, message, dateList, data });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/edit', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.EditBalanceRequest(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.EditBalanceRequest(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const BalanceServiceInstance = typedi_1.Container.get(balance_1.default);
            const { returncode, message } = yield BalanceServiceInstance.EditBalance(req);
            return res.status(200).json({ returncode, message });
        }
        catch (e) {
            return next(e);
        }
    }));
    route.post('/details', middlewares_1.default.isAuth, middlewares_1.default.tokenCheck, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ValidationServiceInstance = typedi_1.Container.get(validation_1.default);
            if (ValidationServiceInstance.GetBalanceDetails(req) == 'incorrectfield') {
                return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
            }
            if (ValidationServiceInstance.GetBalanceDetails(req) == 'blankfield') {
                return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
            }
            const BalanceServiceInstance = typedi_1.Container.get(balance_1.default);
            const { returncode, message, data } = yield BalanceServiceInstance.GetBalanceDetails(req);
            return res.status(200).json({ returncode, message, data });
        }
        catch (e) {
            return next(e);
        }
    }));
};
