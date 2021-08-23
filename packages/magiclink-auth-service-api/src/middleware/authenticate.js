const authenticationService = require('../service/authenticationService');
const ExpiredTokenError = require('../service/error/ExpiredTokenError');
const mapper = require('../mappers/magicLinkTokenMapper');

function handleTokenExpiredError(req, res, err) {
  req.log.debug('MagicLink token is expired.');
  const magicLinkData = mapper.tokenToMagicLinkData(err.tokenPayload);
  return res.redirect(`${magicLinkData.magicLink.expiredLinkRedirectURL}`);
}

function handleInvalidTokenError(req, res, err) {
  req.log.error({ err }, 'MagicLink token is invalid.');
  return res.status(404).send();
}

/**
 * Authenticates the user using the magic link token defined inside the request path param. Sets the magic link token payload data on the request if authentication is successfull.
 *
 * The following logic is used:
 * If the token is valid and is not expired, the JWT token payload data is set on the request object and next function is called.
 * If the token is expired, the user is redirected to the 'expiredLinkRedirectURL' value defined inside the JWT token payload.
 * If the token is invalid, the user is redirected to the 404 error page.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports = async (req, res, next) => {
  try {
    const token = await authenticationService.authenticate(req, res);
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
