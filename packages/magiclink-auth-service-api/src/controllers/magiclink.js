const config = require('../config');
const createMagicLink = require('../interactors/createMagicLink');
const sendMagicLinkEmail = require('../interactors/sendMagicLinkEmail');
const createAuthToken = require('../interactors/createAuthToken');
const logger = require('../util/logger');

function create(req, res) {
  logger.debug('Enter magic link controller');

  const magicLinkData = req.body;
  const magicLinkEndpoint = createMagicLink(req.protocol, req.get('host'), magicLinkData);
  sendMagicLinkEmail(magicLinkData.magicLink.destinationEmail, magicLinkEndpoint);

  return res.status(200).send({ url: magicLinkEndpoint });
}

function login(req, res) {
  logger.debug('Enter login controller');
  const authData = req.magicLinkData.auth;

  const token = createAuthToken(authData.userInformation, authData.tokenValidity);
  console.log('Token auth ' + token);
  setCookie(res, authData.cookieName, token);
  logger.debug('JWT cookie set with success. User is logged in.');

  return res.redirect(req.magicLinkData.magicLink.redirectURL);
}

function setCookie(res, name, token) {
  res.cookie(name, token, {
    maxAge: config.cookie.maxAge,
    httpOnly: true,
  });
}

module.exports = {
  create,
  login,
};
