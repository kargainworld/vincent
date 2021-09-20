import { IResult } from 'mssql';
import VinDecoderConfig from '../types/VinDecoderConfig';
import vinInfo from '../types/vinInfo';
import msSqlPool from '../loaders/msSqlDb';
import VinData from '../models/VinData';
import { readJsonFile } from '../utils/readFiles';

interface jsonDataObj {
  [key: string]: string
}

enum Indexes {
  COUNTRY_START = 0,
  COUNTRY_CLOSE = 2,
  MANUFACTURER_START = 0,
  MANUFACTURER_CLOSE = 3,
  DETAILS_START = 3,
  DETAILS_CLOSE = 8,
  PRODUCTION_YEAR = 9,
  SERIAL_NUMBER = 11,
}
const vinRegex = /^([0-9A-HJ-NPR-Z]{9})([A-HJ-NPR-TV-Y1-9])([0-9A-HJ-NPR-Z])([0-9A-HJ-NPR-Z]{2}\d{4})$/;

export default class VinDecoder {
  private readonly config: VinDecoderConfig = { useDecoder: true };
  private readonly years: jsonDataObj;
  private readonly countries: jsonDataObj;
  private readonly manufacturers: jsonDataObj;

  constructor(config: VinDecoderConfig) {
    Object.assign(this.config, config);

    this.years = readJsonFile('./db/years.json') as jsonDataObj;
    this.countries = readJsonFile('./db/countries.json') as jsonDataObj;
    this.manufacturers = readJsonFile('./db/manufacturers.json') as jsonDataObj;
  }

  public static isVinValid(vin: string): boolean {
    return vinRegex.test(vin.toUpperCase());
  }

  public async getVinData(vinNumber: string): Promise<vinInfo | null> {
    if (!VinDecoder.isVinValid(vinNumber)) {
      return null;
    }

    const vin: string = vinNumber.toUpperCase();
    const decoderResult = this.decodeVin(vin);

    const [dbResult, cacheResult] = await Promise.all([
      this.config.useDatabase && this.getFromDatabase(vin),
      this.config.useCache && this.getFromCacheDb(vin),
    ].filter(Boolean));

    if (dbResult) {
      return { ...dbResult as vinInfo, ...decoderResult } as vinInfo;
    }

    if (cacheResult) {
      return cacheResult as vinInfo;
    }

    if (this.config.useApi) {
      const result = await this.getFromApi(vin);
      if (result) {
        await this.saveToCacheDb(result);

        return result;
      }
    }

    return this.config.useDecoder && decoderResult ? decoderResult : null;
  }

  private async getFromDatabase(vin: string): Promise<vinInfo | null | unknown> {
    const pool = await msSqlPool;
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
  }

  private getFromCacheDb(vin: string): Promise<vinInfo | null> {
    return VinData.find({ vin });
  }

  private saveToCacheDb(vinData: vinInfo) {
    return (new VinData(vinData)).save();
  }

  private getFromApi(vin: string): Promise<vinInfo | null> {
    return new Promise((resolve) => vin && resolve(null));
  }

  private decodeVin(vin: string): vinInfo {
    const vinValues = VinDecoder.splitVin(vin);

    return {
      ...vinValues,
      ModelYear: this.decodeYear(vinValues.ModelYear),
      PlantCountry: this.decodeCountry(vinValues.PlantCountry),
      Make: this.decodeManufacturer(vinValues.Make),
    };
  }

  private static splitVin(number: string): vinInfo {
    return {
      ModelYear: number.charAt(Indexes.PRODUCTION_YEAR),
      PlantCountry: number.substring(Indexes.COUNTRY_START, Indexes.COUNTRY_CLOSE),
      Make: number.substring(Indexes.MANUFACTURER_START, Indexes.MANUFACTURER_CLOSE),
      details: number.substring(Indexes.DETAILS_START, Indexes.DETAILS_CLOSE),
      serialNumber: number.substring(Indexes.SERIAL_NUMBER),
    };
  }

  private decodeYear(code: string): string {
    return this.years[code] as string;
  }

  private decodeCountry(code: string): string {
    return this.countries[code] as string;
  }

  private decodeManufacturer(code: string): string {
    return this.manufacturers[code] as string;
  }

  private mapDatabaseRecord(result: IResult<unknown>): vinInfo {
    return (result.recordset as { [key: string]: string; }[]).reduce((acc, el) => (
      { ...acc, [el.Code]: el.Value }),
    {}) as unknown as vinInfo;
  }
}
