export const config = () => ({
  env: process.env.NODE_ENV,
  app: {
    logLevel: process.env.LOG_LEVEL || 'debug',
    port: parseInt(process.env.PORT, 10),
    baseURL: process.env.BASE_URL,
    secret: process.env.SECRET,
    urlExpirationDaysV1: parseInt(process.env.URL_EXPIRATION_V1, 10) || 9,
    urlExpirationDaysV2: parseInt(process.env.URL_EXPIRATION_V2, 10) || 20,
  },
  db: {
    uri: process.env.MONGO_URI,
  },
});
