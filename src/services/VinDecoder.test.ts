import VinDecoder from './VinDecoder';
import vinInfo from '../types/vinInfo';

describe('VinDecoder class', () => {
  const decoder = new VinDecoder({
    useDecoder: true,
  });

  it('Should decode VIN number', async () => {
    const result1 = await decoder.getVinData('JM1GL1V57H1107892') || {} as vinInfo;

    expect(result1).toEqual({
      Make: 'Mazda',
      ModelYear: 2017,
      PlantCountry: 'Japan',
      details: 'GL1V5',
      serialNumber: '107892',
    });

    const result2 = await decoder.getVinData('JM1GJ1W54G1469567');

    expect(result2).toEqual({
      Make: 'Mazda',
      ModelYear: 2016,
      PlantCountry: 'Japan',
      details: 'GJ1W5',
      serialNumber: '469567',
    });
  });
});
