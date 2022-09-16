"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isAuth_1 = __importDefault(require("./isAuth"));
const tokenCheck = require('./tokenCheck');
const validation = require('./validation');
exports.default = {
    isAuth: isAuth_1.default,
    tokenCheck,
    validation,
};
