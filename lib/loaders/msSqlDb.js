"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = __importDefault(require("mssql"));
const logger_1 = __importDefault(require("./logger"));
const msSqlPool = new mssql_1.default.ConnectionPool({
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    port: Number(String(process.env.SQL_PORT)),
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    options: {
        trustServerCertificate: true,
    },
});
msSqlPool
    .connect()
    .then((pool) => {
    logger_1.default.info('Connected to MS SQL');
    return pool;
})
    .catch((error) => {
    logger_1.default.error('MS SQL connection error', error);
});
exports.default = msSqlPool;
