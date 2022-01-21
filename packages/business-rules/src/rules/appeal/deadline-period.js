const { appeal } = require('../../config');
const isValid = require('../../validation/appeal/type/is-valid');
const { APPEAL_ID } = require('../../constants');
const BusinessRulesError = require('../../lib/business-rules-error');

/**
 * @description Determine the appeal's deadline period.
 *
 * @param {Number} expiryPeriodInWeeks a positive number
 *
 * @throws {BusinessRulesError}
 */
module.exports = (appealType = APPEAL_ID.HOUSEHOLDER) => {
  if (!isValid(appealType)) {
    throw new BusinessRulesError(`${appealType} is not a valid appeal type`);
  }

  return {
    duration: appeal.type[appealType].appealDue.duration,
    time: appeal.type[appealType].appealDue.time,
  };
};
