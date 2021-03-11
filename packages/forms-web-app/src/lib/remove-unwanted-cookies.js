const cookieConfig = require('./client-side/cookie/cookie-config');

const defaultKeepMeCookies = ['connect.sid', cookieConfig.COOKIE_POLICY_KEY];

const removeUnwantedCookies = (req, res, keepTheseCookies = defaultKeepMeCookies) =>
  Object.keys(req.cookies)
    .filter((cookieName) => keepTheseCookies.includes(cookieName) === false)
    .forEach((cookieName) => res.clearCookie(cookieName));

module.exports = {
  defaultKeepMeCookies,
  removeUnwantedCookies,
};
