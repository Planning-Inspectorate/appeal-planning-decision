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
    const appealAPIObject = await axios.get(appealUrl);
    const { horizonId } = appealAPIObject.data;
    logger.info({ horizonId }, 'Horizon ID obtained from Appeals Service API');
    return horizonId;
  } catch (err) {
    logger.error({ err }, 'Unable to retrieve appeal data');
    throw new Error('Current appeal does not contain Horizon ID');
  }
};

module.exports = { getHorizonId };
