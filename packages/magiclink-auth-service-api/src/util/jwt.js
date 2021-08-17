const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports.sign = (payload) => {
  return jwt.sign(payload, config.jwtSigningKey);
};
