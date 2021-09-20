import { Mongoose } from 'mongoose';
import mongoDb from './mongoDb';

describe('Mongo DB connection loader', () => {
  test('Should be an instance of Mongoose', () => {
    expect(mongoDb).toBeInstanceOf(Mongoose);
  });

  test('Should have connect method', () => {
    expect(mongoDb.connect).toBeDefined();
    expect(mongoDb.connect).toBeInstanceOf(Function);
  });

  test('Should have close method', () => {
    expect(mongoDb.connection).toBeDefined();
    expect(mongoDb.connection.close).toBeDefined();
    expect(mongoDb.connection.close).toBeInstanceOf(Function);
  });
});
