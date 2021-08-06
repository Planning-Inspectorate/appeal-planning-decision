const { isValid } = require('date-fns');
const BusinessRulesError = require('../../../lib/business-rules-error');

/**
 * @description a very thin wrapper over date-fns/is-valid.
 *
 * @param {Date} givenDate
 * @returns {boolean}
 */
module.exports = (givenDate) => {
  if (!isValid(givenDate)) {
    throw new BusinessRulesError('The given date must be a valid Date instance');
  }

  return true;
};
