const cryptoUtils = require('../util/crypto');
const logger = require('../util/logger');
const config = require('../config');
const dateUtils = require('../util/dateUtil');

/**
 * This function is mapping the magicLinkData object to the token payload object.
 *
 * @param magicLinkData
 * @returns {{data: {iv: string, content: string}, exp: number}}
 */
function magicLinkDataToToken(magicLinkData) {
  logger.debug('Create magic link token data from magicLinkData');

  return {
    data: cryptoUtils.encrypt(JSON.stringify(magicLinkData)),
    exp: dateUtils.addMillisToCurrentDate(config.magicLinkValidityTimeMillis).getTime(),
  };
}

/**
 * This function is mapping the token payload object to the magicLinkData object.
 *
 * @param tokenData
 * @returns magicLinkData
 */
function tokenToMagicLinkData(tokenData) {
  logger.debug('Create magicLinkData from tokenData');

  const decryptData = cryptoUtils.decrypt(tokenData.data);
  return JSON.parse(decryptData);
}

module.exports = {
  magicLinkDataToToken,
  tokenToMagicLinkData,
};
