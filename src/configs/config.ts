export const config = () => ({
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'jwt_secret',
  jwtExp: process.env.JWT_EXP,
  DbHost: process.env.DB_HOST || 'localhost',
  DbPort: parseInt(process.env.DB_PORT, 10) || 21017,
  DbUsername: process.env.DB_USERNAME || 'root',
  DbName: process.env.DB_NAME,
  DbPassword: process.env.DB_PASSWORD || 'root',
});
