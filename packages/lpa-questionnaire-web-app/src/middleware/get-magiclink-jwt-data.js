const passport = require('passport');
const crypto = require('../lib/crypto');
const logger = require('../lib/logger');

function isJWTExpired(jwtPayload) {
  return jwtPayload.exp <= new Date().valueOf();
}

function getUserData(jwtPayload) {
  if (!jwtPayload.userData) {
    return undefined;
  }

  let userData;
  try {
    userData = JSON.parse(crypto.decrypt(jwtPayload.userData));
  } catch (err) {
    logger.error({ err }, `Error occurred while decrypting Magic Link JWT token ${userData}`);
  }

  return userData;
}

module.exports = (req, res, next) => {
  passport.authenticate('magicLinkJWT', (err, jwtPayload) => {
    if (!jwtPayload) {
      req.log.error('MagicLink JWT token is invalid.');
      return res.status(404).send();
    }

    const userData = getUserData(jwtPayload);
    if (!userData) {
      req.log.error('MagicLink JWT token is missing user data.');
      return res.status(404).send();
    }

    if (isJWTExpired(jwtPayload)) {
      req.log.debug('MagicLink JWT token is expired.');
      return res.redirect(`/${userData.lpaCode}/authentication/your-email/link-expired`);
    }

    req.userData = userData;
    return next();
  })(req, res, next);
};
