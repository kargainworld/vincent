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
const msSqlDb_1 = __importDefault(require("../loaders/msSqlDb"));
const VinData_1 = __importDefault(require("../models/VinData"));
const readFiles_1 = require("../utils/readFiles");
var Indexes;
(function (Indexes) {
    Indexes[Indexes["COUNTRY_START"] = 0] = "COUNTRY_START";
    Indexes[Indexes["COUNTRY_CLOSE"] = 2] = "COUNTRY_CLOSE";
    Indexes[Indexes["MANUFACTURER_START"] = 0] = "MANUFACTURER_START";
    Indexes[Indexes["MANUFACTURER_CLOSE"] = 3] = "MANUFACTURER_CLOSE";
    Indexes[Indexes["DETAILS_START"] = 3] = "DETAILS_START";
    Indexes[Indexes["DETAILS_CLOSE"] = 8] = "DETAILS_CLOSE";
    Indexes[Indexes["PRODUCTION_YEAR"] = 9] = "PRODUCTION_YEAR";
    Indexes[Indexes["SERIAL_NUMBER"] = 11] = "SERIAL_NUMBER";
})(Indexes || (Indexes = {}));
const vinRegex = /^([0-9A-HJ-NPR-Z]{9})([A-HJ-NPR-TV-Y1-9])([0-9A-HJ-NPR-Z])([0-9A-HJ-NPR-Z]{2}\d{4})$/;
class VinDecoder {
    constructor(config) {
        this.config = { useDecoder: true };
        Object.assign(this.config, config);
        this.years = readFiles_1.readJsonFile('./db/years.json');
        this.countries = readFiles_1.readJsonFile('./db/countries.json');
        this.manufacturers = readFiles_1.readJsonFile('./db/manufacturers.json');
    }
    static isVinValid(vin) {
        return vinRegex.test(vin.toUpperCase());
    }
    getVinData(vinNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!VinDecoder.isVinValid(vinNumber)) {
                return null;
            }
            const vin = vinNumber.toUpperCase();
            const decoderResult = this.decodeVin(vin);
            const [dbResult, cacheResult] = yield Promise.all([
                this.config.useDatabase && this.getFromDatabase(vin),
                this.config.useCache && this.getFromCacheDb(vin),
            ].filter(Boolean));
            if (dbResult) {
                return Object.assign(Object.assign({}, dbResult), decoderResult);
            }
            if (cacheResult) {
                return cacheResult;
            }
            if (this.config.useApi) {
                const result = yield this.getFromApi(vin);
                if (result) {
                    yield this.saveToCacheDb(result);
                    return result;
                }
            }
            return this.config.useDecoder && decoderResult ? decoderResult : null;
        });
    }
    getFromDatabase(vin) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield msSqlDb_1.default;
            const query = `EXEC [dbo].[spVinDecode] @v = N'${vin}'`;
            return new Promise((resolve, reject) => {
                pool.request().query(query, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    if (result) {
                        return resolve(this.mapDatabaseRecord(result));
                    }
                    return resolve(null);
                });
            });
        });
    }
    getFromCacheDb(vin) {
        return VinData_1.default.find({ vin });
    }
    saveToCacheDb(vinData) {
        return (new VinData_1.default(vinData)).save();
    }
    getFromApi(vin) {
        return new Promise((resolve) => vin && resolve(null));
    }
    decodeVin(vin) {
        const vinValues = VinDecoder.splitVin(vin);
        return Object.assign(Object.assign({}, vinValues), { ModelYear: this.decodeYear(vinValues.ModelYear), PlantCountry: this.decodeCountry(vinValues.PlantCountry), Make: this.decodeManufacturer(vinValues.Make) });
    }
    static splitVin(number) {
        return {
            ModelYear: number.charAt(Indexes.PRODUCTION_YEAR),
            PlantCountry: number.substring(Indexes.COUNTRY_START, Indexes.COUNTRY_CLOSE),
            Make: number.substring(Indexes.MANUFACTURER_START, Indexes.MANUFACTURER_CLOSE),
            details: number.substring(Indexes.DETAILS_START, Indexes.DETAILS_CLOSE),
            serialNumber: number.substring(Indexes.SERIAL_NUMBER),
        };
    }
    decodeYear(code) {
        return this.years[code];
    }
    decodeCountry(code) {
        return this.countries[code];
    }
    decodeManufacturer(code) {
        return this.manufacturers[code];
    }
    mapDatabaseRecord(result) {
        return result.recordset.reduce((acc, el) => (Object.assign(Object.assign({}, acc), { [el.Code]: el.Value })), {});
    }
}
exports.default = VinDecoder;
