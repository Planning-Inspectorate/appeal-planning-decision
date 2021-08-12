const JwtStrategy = require('passport-jwt/lib').Strategy;
const config = require('../../config');

const { COOKIE_JWT } = require('./strategyName');

const cookieExtractor = (req) => {
  return req.cookies ? req.cookies[`${config.auth.cookie.name}`] : null;
};

module.exports = (passport) => {
  passport.use(
    COOKIE_JWT,
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: config.auth.cookie.jwtKey,
        ignoreExpiration: true,
      },
      (jwtPayload, done) => {
        return done(null, jwtPayload);
      }
    )
  );
};
