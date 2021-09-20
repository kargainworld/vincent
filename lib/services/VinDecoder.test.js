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
const VinDecoder_1 = __importDefault(require("./VinDecoder"));
describe('VinDecoder class', () => {
    const decoder = new VinDecoder_1.default({
        useDecoder: true,
    });
    it('Should decode VIN number', () => __awaiter(void 0, void 0, void 0, function* () {
        const result1 = (yield decoder.getVinData('JM1GL1V57H1107892')) || {};
        expect(result1).toEqual({
            Make: 'Mazda',
            ModelYear: 2017,
            PlantCountry: 'Japan',
            details: 'GL1V5',
            serialNumber: '107892',
        });
        const result2 = yield decoder.getVinData('JM1GJ1W54G1469567');
        expect(result2).toEqual({
            Make: 'Mazda',
            ModelYear: 2016,
            PlantCountry: 'Japan',
            details: 'GJ1W5',
            serialNumber: '469567',
        });
    }));
});
