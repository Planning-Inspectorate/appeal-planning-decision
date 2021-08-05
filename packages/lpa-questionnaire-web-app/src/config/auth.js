const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');

module.exports = function configureStrategy() {
  passport.use(
    'magicLink',
    new JwtStrategy(
      {
        jwtFromRequest: (req) => {
          return req.params?.magiclink;
        },
        secretOrKey: 'secret',
        ignoreExpiration: true,
      },
      (jwtPayload, done) => {
        return done(null, jwtPayload);
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
