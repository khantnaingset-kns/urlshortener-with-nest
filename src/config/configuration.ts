export const config = () => ({
  env: process.env.NODE_ENV,
  app: {
    logLevel: process.env.LOG_LEVEL || 'debug',
    port: parseInt(process.env.PORT, 10),
    secret: process.env.SECRET,
  },
  db: {
    host: process.env.MONGO_HOST,
    port: parseInt(process.env.MONGO_PORT, 10),
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    database: process.env.MONGO_DATABASE,
    uri: process.env.MONGO_URI,
    is_atlas: process.env.MONGO_IS_ATLAS,
    atlas_prefix: process.env.MONGO_ATLAS_PREFIX,
  },
});
