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
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const userModel = require('../../models/user');
module.exports = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer';
    var token = req.headers.authorization.split(' ')[1];
    try {
        var decodedToken = (0, jwt_decode_1.default)(token);
        var useridfromtoken = decodedToken.userid;
        var userCheck;
        var sessionexpired;
        yield userModel.services.findAll({ where: { userid: req.body.userid, isdeleted: false } }).then((data) => {
            if (data.length > 0) {
                userCheck = data[0];
                sessionexpired = userCheck.sessionexpired;
            }
        });
        if (req.body.userid != useridfromtoken) {
            const returncode = "300";
            const message = "Invalid User ID and Token";
            res.status(200).json({
                returncode, message
            });
        }
        else {
            if (sessionexpired == true) {
                const returncode = "302";
                const message = "Session Expired";
                res.status(200).json({
                    returncode, message
                });
            }
            else {
                next();
            }
        }
    }
    catch (e) {
        console.log(e);
        res.status(401).json({
            returncode: "300", message: "Invalid Token"
        });
    }
});
