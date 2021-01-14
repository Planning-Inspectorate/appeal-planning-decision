const connectMongodb = require('connect-mongodb-session');
const session = require('express-session');
const logger = require('./logger');
const config = require('../config');

module.exports = () => {
  const { sessionSecret } = config.server;

  if (!sessionSecret) {
    throw new Error('Session secret must be set');
  }

  const MongoDBStore = connectMongodb(session);

  const store = new MongoDBStore(config.db.session);

  /* istanbul ignore next */
  store.on('error', (err) => {
    logger.error({ err }, 'MongoDB session store error');
  });

  const sessionConfig = {
    store,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {},
  };

  if (config.server.useSecureSessionCookie) {
    sessionConfig.cookie.secure = true; // serve secure cookies
  }

  return sessionConfig;
};
