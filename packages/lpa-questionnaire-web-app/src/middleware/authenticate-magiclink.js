const passportWrapper = require('../auth/passportWrapper');
const crypto = require('../auth/lib/crypto');
const config = require('../config');
const ExpiredJWTError = require('../auth/error/ExpiredJWTError');
const { MAGIC_LINK_JWT } = require('../auth/config').strategyName;
const logger = require('../lib/logger');

function decryptUserData(encryptedUserData) {
  return JSON.parse(crypto.decrypt(encryptedUserData, config.auth.magicLink.cryptoKey));
}

function getUserData(jwtPayload) {
  if (!jwtPayload.userData) {
    logger.error('MagicLink JWT token is missing user data.');
    return undefined;
  }

  let userData;
  try {
    userData = decryptUserData(jwtPayload.userData);
  } catch (err) {
    logger.error({ err }, 'Error occurred while decrypting Magic Link JWT user data.');
  }
  return userData;
}

function handleExpiredJWTError(req, res, err) {
  req.log.debug('MagicLink JWT token is expired.');
  const userData = getUserData(err.jwtPayload);

  if (!userData) {
    return res.status(404).send();
  }
  return res.redirect(`/${userData.lpaCode}/authentication/your-email/link-expired`);
}

function handleJWTError(req, res, err) {
  req.log.error({ err }, 'MagicLink JWT token is invalid.');
  return res.status(404).send();
}

module.exports = async (req, res, next) => {
  return passportWrapper
    .authenticate(MAGIC_LINK_JWT, req, res)
    .then((jwtPayload) => {
      const userData = getUserData(jwtPayload);
      if (!userData) {
        return res.status(404).send();
      }

      req.log.debug('Magic link JWT is valid, use will be authenticated.');
      req.userData = userData;
      return next();
    })
    .catch((err) => {
      if (err instanceof ExpiredJWTError) {
        return handleExpiredJWTError(req, res, err);
      }

      return handleJWTError(req, res, err);
    });
};
