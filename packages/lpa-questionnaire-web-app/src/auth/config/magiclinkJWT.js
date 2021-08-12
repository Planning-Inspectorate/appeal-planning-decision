const JwtStrategy = require('passport-jwt').Strategy;
const config = require('../../config');
const { MAGIC_LINK_JWT } = require('./strategyName');

const queryParamExtractor = (req) => {
  return req.params?.magiclink ? req.params.magiclink : null;
};

module.exports = (passport) => {
  passport.use(
    MAGIC_LINK_JWT,
    new JwtStrategy(
      {
        jwtFromRequest: queryParamExtractor,
        secretOrKey: config.auth.magicLink.jwtKey,
        ignoreExpiration: true,
      },
      (jwtPayload, done) => {
        return done(null, jwtPayload);
      }
    )
  );
};
