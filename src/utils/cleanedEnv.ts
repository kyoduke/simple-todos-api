import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
  MONGO_USER: str(),
  MONGO_PASSWORD: str(),
  JWT_SECRET: str(),
});

export default env;
