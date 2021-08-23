const jwtUtil = require('../util/jwt');
const logger = require('../util/logger');
const dateUtils = require('../util/dateUtil');

module.exports = (userInformation, tokenValidity) => {
  logger.debug('Create authentication JWT.');
  return jwtUtil.sign({
    userInformation,
    exp: dateUtils.addMillisToCurrentDate(tokenValidity).getTime(),
  });
};
