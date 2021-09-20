"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VinData_1 = __importDefault(require("./VinData"));
describe('VinData mongoose model', () => {
    const model = new VinData_1.default();
    it('Model should be defined ', () => {
        expect(VinData_1.default).toBeDefined();
        expect(VinData_1.default).toBeInstanceOf(Object);
        expect(model).toBeDefined();
        expect(model).toBeInstanceOf(Object);
    });
    it('_id should be defined', () => {
        expect(model._id).toBeDefined();
        expect(typeof model._id).toBe('object');
    });
});
