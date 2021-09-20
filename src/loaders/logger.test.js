import logger from './logger';

describe('Winston logger loader', () => {
  it('Should return a Winston instance', () => {
    expect(logger).toBeDefined();
    expect(typeof logger).toBe('object');
  });

  it('Should have logger functions: log, error, warning, info', () => {
    expect(logger.log).toBeDefined();
    expect(logger.log).toBeInstanceOf(Function);
    expect(logger.error).toBeDefined();
    expect(logger.error).toBeInstanceOf(Function);
    expect(logger.info).toBeDefined();
    expect(logger.info).toBeInstanceOf(Function);
  });
});
