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
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./loaders/logger"));
const mongoDb_1 = __importDefault(require("./loaders/mongoDb"));
const msSqlDb_1 = __importDefault(require("./loaders/msSqlDb"));
const VinDecoder_1 = __importDefault(require("./services/VinDecoder"));
const validateVinRequest_1 = __importDefault(require("./middlewares/validateVinRequest"));
const app = express_1.default();
const decoder = new VinDecoder_1.default({
    useDatabase: true,
    useCache: false,
    useApi: false,
    useDecoder: true,
});
app.use(express_1.default.json());
app.get('/vin/:vin', validateVinRequest_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vinData = yield decoder.getVinData(req.params.vin);
        if (vinData) {
            return res.json({ success: true, vinData });
        }
        return res.json({ success: false, error: 105 });
    }
    catch (error) {
        logger_1.default.error('Internal error', error);
        return res.status(500).json({ success: false, error: 500 });
    }
}));
app.get('/health-check', (req, res) => res.json({ success: true }));
const server = app.listen(process.env.PORT);
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([
        new Promise((resolve) => {
            server.close(resolve);
        }),
        new Promise((resolve) => {
            mongoDb_1.default.connection.close(false, resolve);
        }),
        msSqlDb_1.default.close(),
    ]);
    process.exit(0);
}));
