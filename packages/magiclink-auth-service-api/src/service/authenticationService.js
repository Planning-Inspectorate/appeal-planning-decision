const JwtStrategy = require('passport-jwt/lib').Strategy;
const passport = require('passport');
const passportWrapper = require('./passportWrapper');
const config = require('../config');

const AUTH_STRATEGY_NAME = 'JWT';

/**
 * Configuration function that sets up the passport library strategy.
 */
function setUpStrategy() {
  const jwtStrategy = new JwtStrategy(
    {
      jwtFromRequest: (req) => {
        return req.params?.magiclink ? req.params.magiclink : null;
      },
      secretOrKey: config.jwtSigningKey,
      ignoreExpiration: true,
    },
    (jwtPayload, done) => {
      return done(null, jwtPayload);
    },
  );

  passport.use(AUTH_STRATEGY_NAME, jwtStrategy);
}

setUpStrategy();

/**
 * Service that authenticates a user.
 * The purpose of this service is to hide implementation details and to make writing unit tests easier.

 * @param req HTTP request object.
 * @param res HTTP request object.
 * @returns promise that returns token payload if authentication is successful or one of the custom errors @type {ExpiredTokenError|InvalidTokenError} otherwise.
 */
module.exports.authenticate = (req, res) => {
  return passportWrapper.authenticate(AUTH_STRATEGY_NAME, req, res);
};
