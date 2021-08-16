const passport = require('passport');
const ExpiredJWTError = require('./error/ExpiredJWTError');
const InvalidJWTError = require('./error/InvalidJWTError');

function isJWTExpired(jwtPayload) {
  return jwtPayload.exp <= new Date().valueOf();
}

async function authenticate(strategyName, req, res) {
  return new Promise((resolve, reject) => {
    passport.authenticate(strategyName, (err, jwtPayload) => {
      if (!jwtPayload) {
        reject(new InvalidJWTError('Invalid or missing JWT token.'));
      }

      if (isJWTExpired(jwtPayload)) {
        reject(new ExpiredJWTError('JWT Token has expired.', jwtPayload));
      }

      return resolve(jwtPayload);
    })(req, res);
  });
}

module.exports = {
  authenticate,
};
