const jwtUtil = require('../util/jwt');
const logger = require('../util/logger');

module.exports = (userInformation, tokenValidity) => {
  logger.debug('Create authentication JWT.');
  return jwtUtil.sign({
    userInformation: userInformation,
    exp: new Date().getTime() + tokenValidity,
  });
};
