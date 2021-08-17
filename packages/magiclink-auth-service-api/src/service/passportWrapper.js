const passport = require('passport');
const ExpiredTokenError = require('./error/ExpiredTokenError');
const InvalidTokenError = require('./error/InvalidTokenError');

function isTokenExpired(tokenPayload) {
  return tokenPayload.exp <= new Date().valueOf();
}

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
