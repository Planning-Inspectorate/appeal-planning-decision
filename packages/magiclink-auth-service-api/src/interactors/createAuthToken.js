const jwtUtil = require('../util/jwt');
const logger = require('../util/logger');
const dateUtils = require('../util/dateUtil');

/**
 * Creates a JWT token with the given input values.
 *
 * @param userInformation token payload
 * @param tokenValidity token expiration time
 * @returns JWT token
 */
module.exports = (userInformation, tokenValidity) => {
  logger.debug('Create authentication JWT.');
  return jwtUtil.sign({
    userInformation,
    exp: dateUtils.addMillisToCurrentDate(tokenValidity).getTime(),
  });
};
