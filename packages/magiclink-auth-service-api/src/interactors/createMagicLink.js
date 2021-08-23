const jwtUtil = require('../util/jwt');
const logger = require('../util/logger');
const mapper = require('../mappers/magicLinkTokenMapper');

function createMagicLinkToken(magicLinkData) {
  logger.debug('Create magic link token');
  const tokenData = mapper.magicLinkDataToToken(magicLinkData);
  const jwt = jwtUtil.sign(tokenData);

  logger.debug('Magic link token created with success');
  return jwt;
}

module.exports = (protocol, hostname, magicLinkData) => {
  try {
    const magicLinkToken = createMagicLinkToken(magicLinkData);
    return `${protocol}://${hostname}/magiclink/${magicLinkToken}`;
  } catch (error) {
    logger.error(
      { err: { message: error.message, stacktrace: error.stack } },
      'An error occurred while trying to create magic link token',
    );
    throw new Error('An error occurred while trying to create magic link token');
  }
};
