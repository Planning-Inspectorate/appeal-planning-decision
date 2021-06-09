const axios = require('axios');
const logger = require('./lib/logger');

/**
 * Retrieves the horizonId from the event object
 * @param {string} appealId
 * @returns {string} horizonId
 */
const getHorizonId = async (appealId) => {
  try {
    const appealUrl = `${process.env.APPEALS_SERVICE_API_URL}/api/v1/appeals/${appealId}`;
    const appealRes = await axios.get(appealUrl);
    return appealRes.data.appeal.horizonId;
  } catch (err) {
    logger.error({ err }, 'Unable to retrieve appeal data.');
    return 0;
  }
};

module.exports = { getHorizonId };
