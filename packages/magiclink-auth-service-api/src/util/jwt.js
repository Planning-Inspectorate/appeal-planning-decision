const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Creates a new JWT token.
 *
 * @param payload token payload.
 * @returns JWT token.
 */
module.exports.sign = (payload) => {
  return jwt.sign(payload, config.jwtSigningKey);
};
