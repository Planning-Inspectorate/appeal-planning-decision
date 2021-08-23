const cryptoUtils = require('../util/crypto');
const logger = require('../util/logger');
const config = require('../config');
const dateUtils = require('../util/dateUtil');

function magicLinkDataToToken(magicLinkData) {
  logger.debug('Create magic link token data from magicLinkData');

  const encryptedData = cryptoUtils.encrypt(JSON.stringify(magicLinkData));
  return {
    data: encryptedData,
    exp: dateUtils.addMillisToCurrentDate(config.magicLinkValidityTimeMillis).getTime(),
  };
}

function tokenToMagicLinkData(tokenData) {
  logger.debug('Create magicLinkData from tokenData');

  const decryptData = cryptoUtils.decrypt(tokenData.data);
  return JSON.parse(decryptData);
}

module.exports = {
  magicLinkDataToToken,
  tokenToMagicLinkData,
};
