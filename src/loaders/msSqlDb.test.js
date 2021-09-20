import msSqlDb from './msSqlDb';

describe('MS Sql DB connection loader', () => {
  it('Should be instance of ConnectionPool', () => {
    expect(msSqlDb).toBeDefined();
    expect(typeof msSqlDb).toBe('object');
  });

  it('Should have connect method', () => {
    expect(msSqlDb.connect).toBeDefined();
    expect(msSqlDb.connect).toBeInstanceOf(Function);
  });

  it('Should have request method', () => {
    expect(msSqlDb.request).toBeDefined();
    expect(msSqlDb.request).toBeInstanceOf(Function);
    expect(msSqlDb.request().query).toBeDefined();
    expect(msSqlDb.request().query).toBeInstanceOf(Function);
  });
});
