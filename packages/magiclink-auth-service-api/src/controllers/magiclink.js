const config = require('../config');
const createMagicLink = require('../interactors/createMagicLink');
const sendMagicLinkEmail = require('../interactors/sendMagicLinkEmail');
const createAuthToken = require('../interactors/createAuthToken');
const logger = require('../util/logger');
const dateUtils = require('../util/dateUtil');

function getMagicLinkURL(req) {
  return config.magicLinkURL ? config.magicLinkURL : `${req.protocol}://${req.get('host')}`;
}

/**
 * Creates a magic link URL that has a signed JWT token embedded and sends it via email to the given 'destinationEmail'.
 * The JWT contains the encrypted request body data and has an expiration time.
 *
 * @param req HTTP request object that contains the data required for the magic link authentication flow.
 * Request body payload example: {
 *  "magicLink": {
 *    "redirectURL": "http://localhost:9001/appeal-questionnaire/89aa8504-773c-42be-bb68-029716ad9756/task-list",
 *    "expiredLinkRedirectURL": "http://localhost:9001/appeal-questionnaire/E69999999/authentication/your-email/link-expired",
 *    "destinationEmail": "email.test@test.com"
 *  },
 * "auth": {
 *    "userInformation": {
 *      "email": "adriana.test@gmail.com",
 *      "lpaCode": "E69999999"
 *    },
 *    "tokenValidity": 400000,
 *    "cookieName": "authCookie"
 *  }
 * }
 * @param res HTTP response object.
 * @returns magicLink URL in case of success
 */
function initiateMagicLinkFlow(req, res) {
  logger.debug('Enter magic link controller');

  const magicLinkData = req.body;
  const magicLinkURL = getMagicLinkURL(req);
  const magicLinkEndpoint = createMagicLink(magicLinkURL, magicLinkData);

  // we don't need to wait for the response
  sendMagicLinkEmail(magicLinkData.magicLink.destinationEmail, magicLinkEndpoint);

  return res.status(201).send({ magicLink: magicLinkEndpoint });
}

function setCookie(res, name, token) {
  res.cookie(name, token, {
    expires: dateUtils.addMillisToCurrentDate(config.cookieValidityTimeMillis),
    httpOnly: true,
  });
}

/**
 * Authenticates user by creating a signed JWT token and setting it inside a cookie. The JWT token payload contains
 * the 'magicLinkData.auth' object received in the request payload.
 *
 * @returns redirects to the 'redirectURL' attribute value in case of success.
 */
function login(req, res) {
  logger.debug('Enter login controller');
  const authData = req.magicLinkData.auth;

  const token = createAuthToken(authData.userInformation, authData.tokenValidity);

  setCookie(res, authData.cookieName, token);
  logger.debug('JWT cookie set with success. User is logged in.');

  return res.redirect(req.magicLinkData.magicLink.redirectURL);
}

module.exports = {
  initiateMagicLinkFlow,
  login,
};
