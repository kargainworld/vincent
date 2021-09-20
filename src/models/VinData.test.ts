import VinData from './VinData';

describe('VinData mongoose model', () => {
  const model = new VinData();

  it('Model should be defined ', () => {
    expect(VinData).toBeDefined();
    expect(VinData).toBeInstanceOf(Object);
    expect(model).toBeDefined();
    expect(model).toBeInstanceOf(Object);
  });

  it('_id should be defined', () => {
    expect(model._id).toBeDefined();
    expect(typeof model._id).toBe('object');
  });
});
