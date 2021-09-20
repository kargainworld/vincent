"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateVinRequest_1 = __importDefault(require("./validateVinRequest"));
const requestMock = (vin) => ({ params: { vin } });
const responseMock = (json) => ({ json });
describe('Express middleware for validating vin format', () => {
    let json;
    let next;
    beforeEach(() => {
        json = jest.fn();
        next = jest.fn();
    });
    it('Should call next', () => {
        validateVinRequest_1.default(requestMock('JM1GJ1W52G1404748'), responseMock(json), next);
        expect(json).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
    });
    it('Should return 101 error if empty value', () => {
        validateVinRequest_1.default(requestMock(undefined), responseMock(json), next);
        expect(json).toHaveBeenLastCalledWith({ success: false, error: 101 });
        expect(next).toHaveBeenCalledTimes(0);
        validateVinRequest_1.default(requestMock(''), responseMock(json), next);
        expect(json).toHaveBeenLastCalledWith({ success: false, error: 101 });
        expect(next).toHaveBeenCalledTimes(0);
    });
    it('Should return 102 error if value is too long', () => {
        validateVinRequest_1.default(requestMock('JM1GJ1W52G1404748a'), responseMock(json), next);
        expect(json).toHaveBeenLastCalledWith({ success: false, error: 102 });
        expect(next).toHaveBeenCalledTimes(0);
        validateVinRequest_1.default(requestMock('aJM1GJ1W52G1404748'), responseMock(json), next);
        expect(json).toHaveBeenLastCalledWith({ success: false, error: 102 });
        expect(next).toHaveBeenCalledTimes(0);
    });
    it('Should return 103 error if value is too short', () => {
        validateVinRequest_1.default(requestMock('JM1GJ1W52G'), responseMock(json), next);
        expect(json).toHaveBeenLastCalledWith({ success: false, error: 103 });
        expect(next).toHaveBeenCalledTimes(0);
        validateVinRequest_1.default(requestMock('JM1GJ1W52G140474'), responseMock(json), next);
        expect(json).toHaveBeenLastCalledWith({ success: false, error: 103 });
        expect(next).toHaveBeenCalledTimes(0);
    });
    it('Should return 104 error if value has wrong format', () => {
        validateVinRequest_1.default(requestMock('aaaaaaaaaaaaaaaaa'), responseMock(json), next);
        expect(json).toHaveBeenLastCalledWith({ success: false, error: 104 });
        expect(next).toHaveBeenCalledTimes(0);
        validateVinRequest_1.default(requestMock('00000000000000000'), responseMock(json), next);
        expect(json).toHaveBeenLastCalledWith({ success: false, error: 104 });
        expect(next).toHaveBeenCalledTimes(0);
    });
});
