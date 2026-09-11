// loadEnvFile is module-scoped; it is not available as a Node global.
// eslint-disable-next-line n/prefer-global/process -- import required for loadEnvFile
import { loadEnvFile } from 'node:process';

try {
  loadEnvFile();
} catch (error) {
  // .env is optional locally; CI supplies WEB_BASE_URL explicitly.
  if (
    !(error instanceof Error) ||
    !('code' in error) ||
    error.code !== 'ENOENT'
  ) {
    throw error;
  }
}

function requireHttpUrl(name: string, value: string | undefined): string {
  const trimmed = value?.trim();

  if (!trimmed || !URL.canParse(trimmed)) {
    throw new Error(`[Configuration] ${name} must be a valid absolute URL.`);
  }

  const parsed = new URL(trimmed);

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(
      `[Configuration] ${name} must use the http or https protocol.`,
    );
  }

  return parsed.href;
}

const webBaseUrl = requireHttpUrl(
  'WEB_BASE_URL',
  globalThis.process.env.WEB_BASE_URL,
);
const apiBaseUrl = requireHttpUrl(
  'API_BASE_URL',
  globalThis.process.env.API_BASE_URL ?? webBaseUrl,
);

export const environmentConfig = {
  webBaseUrl,
  apiBaseUrl,
};
