const passport = require('passport');
const crypto = require('../lib/crypto');

function isTokenExpired(jwtPayload) {
  return jwtPayload.exp >= new Date();
}

module.exports = (req, res, next) => {
  passport.authenticate('magicLink', (err, jwtPayload, info) => {
    if (isTokenExpired(jwtPayload)) {
      return res.redirect(`${jwtPayload.lpaCode}/authentication/your-email`);
    }

    const data = crypto.decrypt(jwtPayload.data);

    return req.login(data.user, function (loginErr) {
      if (loginErr) {
        return next(loginErr);
      }

      return res.redirect(data.redirectURL);
    });
  })(req, res, next);
};
