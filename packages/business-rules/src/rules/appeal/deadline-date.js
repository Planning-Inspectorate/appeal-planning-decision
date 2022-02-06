const { add, endOfDay, isValid: isDateValid } = require('date-fns');
const { appeal } = require('../../config');
const isValid = require('../../validation/appeal/type/is-valid');
const isValidApplicationDecision = require('../../validation/appeal/application-decision/is-valid');
const { APPEAL_ID, APPLICATION_DECISION } = require('../../constants');
const BusinessRulesError = require('../../lib/business-rules-error');

/**
 * @description Given an appeal's decision date, and an expiry period, determine the appeal's
 * deadline date.
 *
 * @param {Date} decisionDate
 * @param {string} appealType
 * @param {string} applicationDecision
 * @returns {Date}
 *
 * @throws {BusinessRulesError}
 */
module.exports = (
  decisionDate,
  appealType = APPEAL_ID.HOUSEHOLDER,
  applicationDecision = APPLICATION_DECISION.REFUSED,
) => {
  const type = appealType === null ? APPEAL_ID.HOUSEHOLDER : appealType;
  const decision =
    applicationDecision === null ? APPLICATION_DECISION.REFUSED : applicationDecision;

  if (!isValidApplicationDecision(decision)) {
    throw new BusinessRulesError(`${decision} must be a valid application decision`);
  }

  if (!isDateValid(decisionDate)) {
    throw new BusinessRulesError('The given date must be a valid Date instance');
  }

  if (!isValid(type)) {
    throw new BusinessRulesError(`${type} is not a valid appeal type`);
  }

  const duration =
    appeal.type[type].appealDue[decision] === undefined
      ? appeal.type[type].appealDue.duration
      : appeal.type[type].appealDue[decision].duration;
  const time =
    appeal.type[type].appealDue[decision] === undefined
      ? appeal.type[type].appealDue.time
      : appeal.type[type].appealDue[decision].time;

  return add(endOfDay(decisionDate), {
    [duration]: time,
  });
};
