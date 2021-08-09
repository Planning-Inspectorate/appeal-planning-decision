const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const config = require('../config');

module.exports = function configureStrategy() {
  passport.use(
    'magicLinkJWT',
    new JwtStrategy(
      {
        jwtFromRequest: (req) => {
          return req.params?.magiclink;
        },
        secretOrKey: config.auth.jwtKey,
        ignoreExpiration: true,
      },
      (jwtPayload, done) => {
        return done(null, jwtPayload);
      }
    )
  );
};
