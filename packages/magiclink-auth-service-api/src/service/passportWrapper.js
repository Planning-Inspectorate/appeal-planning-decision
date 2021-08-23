const passport = require('passport');
const ExpiredTokenError = require('./error/ExpiredTokenError');
const InvalidTokenError = require('./error/InvalidTokenError');

function isTokenExpired(tokenPayload) {
  return tokenPayload.exp <= new Date().valueOf();
}

/**
 * Wrapper function on top of the passport library.
 *
 * @param strategyName passportStrategy
 * @param req HTTP request object
 * @param res HTTP response object
 * @returns {Promise<unknown>} promise that returns token payload if passport authentication is successful or one of the custom errors @type {ExpiredTokenError|InvalidTokenError} otherwise.
 */
async function authenticate(strategyName, req, res) {
  return new Promise((resolve, reject) => {
    passport.authenticate(strategyName, (err, tokenPayload) => {
      if (!tokenPayload) {
        reject(new InvalidTokenError('Invalid or missing token.'));
      }

      if (isTokenExpired(tokenPayload)) {
        reject(new ExpiredTokenError('Token has expired.', tokenPayload));
      }

      return resolve(tokenPayload);
    })(req, res);
  });
}

module.exports = {
  authenticate,
};
