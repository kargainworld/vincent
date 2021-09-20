"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const MONGODB_URL = process.env.MONGODB_URL;
if (MONGODB_URL) {
    mongoose_1.default.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then();
    mongoose_1.default.connection.on('connected', () => {
        logger_1.default.info('MongoDB connected');
    });
    mongoose_1.default.connection.on('error', (err) => {
        logger_1.default.error('MongoDB connection error', err);
        process.exit(1);
    });
}
exports.default = mongoose_1.default;
