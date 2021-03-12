const LPASchema = require('../schemas/lpa');
const logger = require('../lib/logger');

const getLpa = async (id) => {
  const data = await LPASchema.findOne({ id });

  if (!data) {
    logger.debug({ id }, 'No LPA found');
  } else {
    logger.debug({ id, data }, 'LPA found');
  }

  return data;
};

module.exports = {
  getLpa,
};
