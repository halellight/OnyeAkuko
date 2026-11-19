import { Oluso, registerOlusoProcessHandlers, createOnRequestError } from '@oluso/nextjs';

const apiKey = process.env.OLUSO_API_KEY || 'unconfigured';
const isConfigured = Boolean(process.env.OLUSO_API_KEY);

export const oluso = new Oluso({
  apiKey,
  environment: process.env.NODE_ENV || 'development',
  shouldReport: () => isConfigured,
  logToConsole: isConfigured,
});

export async function register() {
  if (isConfigured) {
    registerOlusoProcessHandlers(oluso);
  }
}

export const onRequestError = createOnRequestError(oluso);
