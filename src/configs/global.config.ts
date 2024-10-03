import * as dotenv from 'dotenv';

dotenv.config();

const globallConfig: any = {
  jwt_secret: process.env.JWT_SECRET,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    dialect: process.env.DB_DIALECT,
    pass: process.env.DB_PASS,
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
};

export default globallConfig;
