"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
exports.default = ({ models }) => {
    try {
        models.forEach(m => {
            typedi_1.Container.set(m.name, m.model);
        });
        return {};
    }
    catch (e) {
        throw e;
    }
};
