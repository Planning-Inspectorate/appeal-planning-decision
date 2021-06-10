const axios = require('axios');
const logger = require('./lib/logger');
const config = require('./config');

/**
 * Retrieves the horizonId from the event object
 * @param {string} appealId
 * @returns {string} horizonId
 */
const getHorizonId = async (appealId) => {
  try {
    const appealUrl = `${config.appealsService.url}/api/v1/appeals/${appealId}`;
    logger.info({ appealUrl }, 'appealUrl');
    const appealAPIObject = await axios.get(appealUrl);
    logger.info({ appealAPIObject }, 'appealRes');
    return appealAPIObject.data.horizonId;
  } catch (err) {
    logger.error({ err }, 'Unable to retrieve appeal data.');
    return 0;
  }
};

module.exports = { getHorizonId };
