const { isValid } = require('date-fns');
const BusinessRuleError = require('../../../lib/business-rule-error');

/**
 * @description a very thin wrapper over date-fns/is-valid.
 *
 * @param {Date} givenDate
 * @returns {boolean}
 */
module.exports = (givenDate) => {
  if (!isValid(givenDate)) {
    throw new BusinessRuleError('The given date must be a valid Date instance');
  }

  return true;
};
