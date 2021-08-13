const JwtStrategy = require('passport-jwt').Strategy;
const config = require('../config');
const MAGIC_LINK_JWT = 'magicLink_JWT_auth_strategy';

const queryParamExtractor = (req) => {
  return req.params?.magiclink ? req.params.magiclink : null;
};

function use(passport) {
  passport.use(
    MAGIC_LINK_JWT,
    new JwtStrategy(
      {
        jwtFromRequest: queryParamExtractor,
        secretOrKey: config.jwtKey,
        ignoreExpiration: true,
      },
      (jwtPayload, done) => {
        return done(null, jwtPayload);
      },
    ),
  );
}

module.exports = {
  use,
  name: MAGIC_LINK_JWT,
};
