const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports.sign = (payload) => {
  // TODO sign with RSA SHA256
  return jwt.sign(payload, config.jwtKey);
};
