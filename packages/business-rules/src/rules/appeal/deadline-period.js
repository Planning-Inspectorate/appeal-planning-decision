const { appeal } = require('../../config');
const isValid = require('../../validation/appeal/type/is-valid');
const isValidApplicationDecision = require('../../validation/appeal/application-decision/is-valid');
const { APPEAL_ID } = require('../../constants');
const BusinessRulesError = require('../../lib/business-rules-error');

/**
 * @description Determine the appeal's deadline period.
 *
 * @param {string} appealType
 * @param {string} applicationDecision
 *
 * @return {string} appeal deadling duration and time
 *
 * @throws {BusinessRulesError}
 */
module.exports = (appealType = APPEAL_ID.HOUSEHOLDER, applicationDecision) => {
  if (!isValid(appealType)) {
    throw new BusinessRulesError(`${appealType} is not a valid appeal type`);
  }

  if (!isValidApplicationDecision(applicationDecision)) {
    throw new BusinessRulesError(`${applicationDecision} is not a valid application decision`);
  }

  const duration =
    appeal.type[appealType].appealDue[applicationDecision] === undefined
      ? appeal.type[appealType].appealDue.duration
      : appeal.type[appealType].appealDue[applicationDecision].duration;
  const time =
    appeal.type[appealType].appealDue[applicationDecision] === undefined
      ? appeal.type[appealType].appealDue.time
      : appeal.type[appealType].appealDue[applicationDecision].time;

  return {
    duration,
    time,
  };
};
