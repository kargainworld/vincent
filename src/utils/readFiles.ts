import { readFileSync } from 'fs';

export function readJsonFile(filepath: string): Record<string, unknown> {
  try {
    const data = readFileSync(filepath, 'utf-8');

    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export function readXmlFile(filepath: string): Record<string, unknown> {
  try {
    const data = readFileSync(filepath, 'utf-8');

    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}
