"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { createLogger, format, transports } = winston_1.default;
const { combine, timestamp, json, splat, } = format;
const logger = createLogger({
    format: combine(json(), splat(), timestamp({ format: 'DD-MM-YY HH:mm:ss' })),
    transports: process.env.NODE_ENV === 'production'
        ? [new transports.File({ filename: 'logs.log', level: 'error' })]
        : [new transports.Console({ level: 'debug' })],
});
exports.default = logger;
