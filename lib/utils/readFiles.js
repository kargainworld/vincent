"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readXmlFile = exports.readJsonFile = void 0;
const fs_1 = require("fs");
function readJsonFile(filepath) {
    try {
        const data = fs_1.readFileSync(filepath, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        return {};
    }
}
exports.readJsonFile = readJsonFile;
function readXmlFile(filepath) {
    try {
        const data = fs_1.readFileSync(filepath, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        return {};
    }
}
exports.readXmlFile = readXmlFile;
