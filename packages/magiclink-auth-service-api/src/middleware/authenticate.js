const passportWrapper = require('../util/auth/passportWrapper');
const ExpiredTokenError = require('../util/auth/error/ExpiredTokenError');
const jwtAuthStrategy = require('../config/jwtAuthStrategy');
const mapper = require('../mappers/magicLinkTokenMapper');

function handleTokenExpiredError(req, res, err) {
  req.log.debug('MagicLink token is expired.');
  const magicLinkData = mapper.tokenToMagicLinkData(err.jwtPayload);
  return res.redirect(`${magicLinkData.magicLink.expiredLinkRedirectURL}`);
}

function handleInvalidTokenError(req, res, err) {
  req.log.error({ err }, 'MagicLink token is invalid.');
  return res.status(404).send();
}

module.exports = async (req, res, next) => {
  try {
    const token = await passportWrapper.authenticate(jwtAuthStrategy.name, req, res);
    req.log.debug('MagicLink token is valid.');

    req.magicLinkData = mapper.tokenToMagicLinkData(token);
    return next();
  } catch (err) {
    if (err instanceof ExpiredTokenError) {
      return handleTokenExpiredError(req, res, err);
    }

    return handleInvalidTokenError(req, res, err);
  }
};
