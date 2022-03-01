const LPASchema = require('../schemas/lpa');
const logger = require('../lib/logger');

const getLpa = async (id) => {
  let lpa;

  try {
    lpa = await LPASchema.findOne({ id });
  } catch (err) {
    logger.error({ err, id }, `Unable to find LPA for code ${id}`);
  }

  logger.debug({ lpa }, 'LPA found');

  if (lpa && lpa.email && lpa.name) {
    logger.debug({ lpa }, 'LPA found');
    return lpa;
  }

  throw new Error(`Unable to find LPA email or name for code ${id}`);
};

module.exports = {
  getLpa,
};
