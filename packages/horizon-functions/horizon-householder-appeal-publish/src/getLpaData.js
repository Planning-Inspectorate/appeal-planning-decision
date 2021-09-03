const axios = require('axios');
const config = require('./config');

/**
 * Get LPA Data
 *
 * Returns the LPA data
 *
 * @param log
 * @param code
 * @returns {Promise<{ id: string, name: string, inTrial: boolean, england: boolean, wales: boolean, horizonId: string }>}
 */

const getLpaData = async (log, code) => {
  log.info({ code }, 'Getting LPA data from Appeals Service API');

  const { data } = await axios.get(`/api/v1/local-planning-authorities/${code}`, {
    baseURL: config.appealsService.url,
  });

  if (!data?.horizonId) {
    log.error({ data }, 'LPA not found');
    throw new Error('Unknown LPA');
  }

  return data;
};

module.exports = { getLpaData };
