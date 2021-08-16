const JwtStrategy = require('passport-jwt/lib').Strategy;
const passport = require('passport');
const config = require('../../config');
const passportWrapper = require('./passportWrapper');

const AUTH_STRATEGY_NAME = 'JWT';

function setUpAuthStrategy() {
  const jwtStrategy = new JwtStrategy(
    {
      jwtFromRequest: (req) => (req.cookies ? req.cookies[`${config.auth.tokenCookieName}`] : null),
      secretOrKey: config.auth.jwtSigningKey,
      ignoreExpiration: true,
    },
    (jwtPayload, done) => {
      return done(null, jwtPayload);
    }
  );

  passport.use(AUTH_STRATEGY_NAME, jwtStrategy);
}

setUpAuthStrategy();

module.exports.authenticate = (req, res) => {
  return passportWrapper.authenticate(AUTH_STRATEGY_NAME, req, res);
};
