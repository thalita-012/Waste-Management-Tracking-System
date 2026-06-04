import dotenv from 'dotenv';

dotenv.config();

/**
 * Application environment variables
 */
export const env = {
  PORT: Number(process.env.PORT) || 3000,
};