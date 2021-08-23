const config = require('../config');
const createMagicLink = require('../interactors/createMagicLink');
const sendMagicLinkEmail = require('../interactors/sendMagicLinkEmail');
const createAuthToken = require('../interactors/createAuthToken');
const logger = require('../util/logger');
const dateUtils = require('../util/dateUtil');

function create(req, res) {
  logger.debug('Enter magic link controller');

  const magicLinkData = req.body;
  const magicLinkEndpoint = createMagicLink(req.protocol, req.get('host'), magicLinkData);

  sendMagicLinkEmail(magicLinkData.magicLink.destinationEmail, magicLinkEndpoint);

  return res.status(201).send({ magicLink: magicLinkEndpoint });
}

function setCookie(res, name, token) {
  res.cookie(name, token, {
    expires: dateUtils.addMillisToCurrentDate(config.cookieValidityTimeMillis),
    httpOnly: true,
  });
}

function login(req, res) {
  logger.debug('Enter login controller');
  const authData = req.magicLinkData.auth;

  const token = createAuthToken(authData.userInformation, authData.tokenValidity);

  setCookie(res, authData.cookieName, token);
  logger.debug('JWT cookie set with success. User is logged in.');

  return res.redirect(req.magicLinkData.magicLink.redirectURL);
}

module.exports = {
  create,
  login,
};
