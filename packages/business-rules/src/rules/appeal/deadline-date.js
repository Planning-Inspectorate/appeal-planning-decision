const { add, endOfDay, isValid: isDateValid } = require('date-fns');
const { appeal } = require('../../config');
const isValid = require('../../validation/appeal/type/is-valid');
const { APPEAL_ID } = require('../../constants');
const BusinessRuleError = require('../../lib/business-rule-error');

/**
 * @description Given an appeal's decision date, and an expiry period, determine the appeal's
 * deadline date.
 *
 * @param {Date} decisionDate
 * @param {Number} expiryPeriodInWeeks a positive number
 * @returns {Date}
 *
 * @throws {BusinessRuleError}
 */
module.exports = (decisionDate, appealType = APPEAL_ID.HOUSEHOLDER) => {
  if (!isDateValid(decisionDate)) {
    throw new BusinessRuleError('The given date must be a valid Date instance');
  }

  if (!isValid(appealType)) {
    throw new BusinessRuleError(`${appealType} is not a valid appeal type`);
  }

  return add(endOfDay(decisionDate), {
    [appeal.type[appealType].appealDue.duration]: appeal.type[appealType].appealDue.time,
  });
};
