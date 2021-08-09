const config = require('../config');

function login(req, res) {
  req.log.debug('Get jwt for authentication');
  // TODO get JWT token
  const jwt = '';
  res.cookie(config.auth.jwtCookieName, jwt, {
    maxAge: config.auth.jwtCookieMaxAge,
    httpOnly: true,
  });

  req.log.debug('JWT cookie set with success');
  return res.redirect(req.userData.redirectURL);
}

module.exports = {
  login,
};
