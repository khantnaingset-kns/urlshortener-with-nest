export const config = () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  app: {
    logLevel: process.env.LOG_LEVEL || 'debug',
  },
  mongo: {
    host: process.env.MONGO_HOST,
    port: parseInt(process.env.MONGO_PORT, 10),
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
  },
});
