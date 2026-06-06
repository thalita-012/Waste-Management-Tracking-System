import 'dotenv/config';

const getOptionalEnv = (name: string) => process.env[name]?.trim() || undefined;

const getNumberEnv = (name: string, fallback: number) => {
  const value = getOptionalEnv(name);
  const parsed = value ? Number(value) : NaN;

  return Number.isFinite(parsed) ? parsed : fallback;
};

const encodeDbPart = (value: string) => encodeURIComponent(value);

const buildDatabaseUrl = () => {
  const host = getOptionalEnv('DB_HOST') || 'localhost';
  const port = getOptionalEnv('DB_PORT') || '5432';
  const user = getOptionalEnv('DB_USER') || 'postgres';
  const password = getOptionalEnv('DB_PASSWORD');
  const database = getOptionalEnv('DB_NAME') || 'postgres';
  const credentials = password ? `${encodeDbPart(user)}:${encodeDbPart(password)}` : encodeDbPart(user);

  return `postgresql://${credentials}@${host}:${port}/${database}`;
};

export const env = {
  nodeEnv: getOptionalEnv('NODE_ENV') || 'development',
  port: getNumberEnv('PORT', 3000),
  jwtSecret: getOptionalEnv('JWT_SECRET') || 'your_fallback_secret',
  database: {
    host: getOptionalEnv('DB_HOST') || 'localhost',
    port: getNumberEnv('DB_PORT', 5432),
    user: getOptionalEnv('DB_USER') || 'postgres',
    password: getOptionalEnv('DB_PASSWORD'),
    name: getOptionalEnv('DB_NAME') || 'postgres',
    url: getOptionalEnv('DATABASE_URL') || buildDatabaseUrl(),
  },
  bakong: {
    apiBaseUrl: getOptionalEnv('BAKONG_API_BASE_URL'),
    apiToken: getOptionalEnv('BAKONG_API_TOKEN'),
    accountId: getOptionalEnv('BAKONG_ACCOUNT_ID'),
    accountInformation: getOptionalEnv('BAKONG_ACCOUNT_INFORMATION'),
    merchantName: getOptionalEnv('BAKONG_MERCHANT_NAME'),
    merchantCity: getOptionalEnv('BAKONG_MERCHANT_CITY') || 'Phnom Penh',
    merchantId: getOptionalEnv('BAKONG_MERCHANT_ID'),
    acquiringBank: getOptionalEnv('BAKONG_ACQUIRING_BANK'),
    qrExpirationMinutes: getNumberEnv('BAKONG_QR_EXPIRATION_MINUTES', 5),
  },
};

export const getRequiredConfig = (name: string, value?: string) => {
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
};
