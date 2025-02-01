
export const EnvConfiguration = () => ({
  PORTAPP:     process.env.PORTAPP,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME:     process.env.DB_NAME,
  DB_HOST:     process.env.DB_HOST,
  DB_PORT:     process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  JWT_SECRET:  process.env.JWT_SECRET,
  EMAIL_HOST:  process.env.EMAIL_HOST,
  EMAIL_PASS: process.env.EMAIL_PASS
});
