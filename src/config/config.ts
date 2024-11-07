import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  VERSION: String(process.env.VERSION) || 'undefined',
  PORT: Number(process.env.PORT) || 3000,
  CERT_KEY: String(process.env.CERT_KEY_PATH) || 'config/certificates/key.pem',
  CERT_CERT: String(process.env.CERT_CERT_PATH) || 'config/certificates/cert.pem',
  SECRET_KEY: String(process.env.SECURITY_SECRET_KEY) || "SECRET_KEY",
  ENV: String(process.env.NODE_ENV) || 'development',
  PRODUCTS_API: String(process.env.PRODUCTS_API) || 'https://fakestoreapi.com/products',
  PRODUCTS_DATA: path.resolve(__dirname, String(process.env.PRODUCTS_PATH)) || path.resolve(__dirname, '../data/products.json'),
  USERS_DATA: path.resolve(__dirname, String(process.env.USERS_PATH)) || path.resolve(__dirname, '../data/users.json'),
  BASE_PATH: String(process.env.BASE_PATH).replace("{version}", String(process.env.VERSION)) || '/api/v1',
  TEST_LOGS_PATH: String(process.env.TEST_LOGS_PATH) || 'logs/app.log'
};