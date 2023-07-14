"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./routes/auth"));
const seat_1 = __importDefault(require("./routes/seat"));
const trip_1 = __importDefault(require("./routes/trip"));
const user_1 = __importDefault(require("./routes/user"));
const gate_1 = __importDefault(require("./routes/gate"));
const routes_1 = __importDefault(require("./routes/routes"));
const subroute_1 = __importDefault(require("./routes/subroute"));
// guaranteed to get dependencies
exports.default = () => {
    const app = (0, express_1.Router)();
    (0, auth_1.default)(app);
    (0, user_1.default)(app);
    (0, seat_1.default)(app);
    (0, trip_1.default)(app);
    (0, gate_1.default)(app);
    (0, routes_1.default)(app);
    (0, subroute_1.default)(app);
    return app;
};
