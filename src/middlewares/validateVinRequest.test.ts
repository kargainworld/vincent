import { Request, Response, NextFunction } from 'express';
import validateVinRequest from './validateVinRequest';

const requestMock = (vin: string | undefined) => ({ params: { vin } } as unknown as Request);
const responseMock = (json: jest.FunctionLike) => ({ json } as unknown as Response);

describe('Express middleware for validating vin format', () => {
  let json: jest.FunctionLike;
  let next: NextFunction;

  beforeEach(() => {
    json = jest.fn();
    next = jest.fn();
  });

  it('Should call next', () => {
    validateVinRequest(requestMock('JM1GJ1W52G1404748'), responseMock(json), next);
    expect(json).toHaveBeenCalledTimes(0);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('Should return 101 error if empty value', () => {
    validateVinRequest(requestMock(undefined), responseMock(json), next);
    expect(json).toHaveBeenLastCalledWith({ success: false, error: 101 });
    expect(next).toHaveBeenCalledTimes(0);

    validateVinRequest(requestMock(''), responseMock(json), next);
    expect(json).toHaveBeenLastCalledWith({ success: false, error: 101 });
    expect(next).toHaveBeenCalledTimes(0);
  });

  it('Should return 102 error if value is too long', () => {
    validateVinRequest(requestMock('JM1GJ1W52G1404748a'), responseMock(json), next);
    expect(json).toHaveBeenLastCalledWith({ success: false, error: 102 });
    expect(next).toHaveBeenCalledTimes(0);

    validateVinRequest(requestMock('aJM1GJ1W52G1404748'), responseMock(json), next);
    expect(json).toHaveBeenLastCalledWith({ success: false, error: 102 });
    expect(next).toHaveBeenCalledTimes(0);
  });

  it('Should return 103 error if value is too short', () => {
    validateVinRequest(requestMock('JM1GJ1W52G'), responseMock(json), next);
    expect(json).toHaveBeenLastCalledWith({ success: false, error: 103 });
    expect(next).toHaveBeenCalledTimes(0);

    validateVinRequest(requestMock('JM1GJ1W52G140474'), responseMock(json), next);
    expect(json).toHaveBeenLastCalledWith({ success: false, error: 103 });
    expect(next).toHaveBeenCalledTimes(0);
  });

  it('Should return 104 error if value has wrong format', () => {
    validateVinRequest(requestMock('aaaaaaaaaaaaaaaaa'), responseMock(json), next);
    expect(json).toHaveBeenLastCalledWith({ success: false, error: 104 });
    expect(next).toHaveBeenCalledTimes(0);

    validateVinRequest(requestMock('00000000000000000'), responseMock(json), next);
    expect(json).toHaveBeenLastCalledWith({ success: false, error: 104 });
    expect(next).toHaveBeenCalledTimes(0);
  });
});
