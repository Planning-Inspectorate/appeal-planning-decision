const JwtStrategy = require('passport-jwt/lib').Strategy;
const passport = require('passport');
const passportWrapper = require('./passportWrapper');
const config = require('../config');

const AUTH_STRATEGY_NAME = 'JWT';

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

module.exports.authenticate = (req, res) => {
  return passportWrapper.authenticate(AUTH_STRATEGY_NAME, req, res);
};
