import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env')) {
  loadEnvFile();
}

const baseUrl = process.env.BASE_URL?.trim();

if (!baseUrl || !URL.canParse(baseUrl)) {
  throw new Error('[Configuration] BASE_URL must be a valid absolute URL.');
}

const parsedBaseUrl = new URL(baseUrl);

if (!['http:', 'https:'].includes(parsedBaseUrl.protocol)) {
  throw new Error(
    '[Configuration] BASE_URL must use the http or https protocol.',
  );
}

export const environmentConfig = {
  baseUrl: parsedBaseUrl.toString(),
};
