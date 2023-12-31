import * as dotenv from 'dotenv';

dotenv.config();

const { PORT, MONGO_URL, DB_USER, DB_HOST, DB_PASS, DB_NAME, DB_PORT } = process.env;

export default {
  PORT,
  MONGO_URL,
  DB_USER,
  DB_HOST,
  DB_PASS,
  DB_NAME,
  DB_PORT,
};