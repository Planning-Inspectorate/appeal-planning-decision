const { add, endOfDay, isValid: isDateValid } = require('date-fns');
const { appeal } = require('../../config');
const isValid = require('../../validation/appeal/type/is-valid');
const { APPEAL_ID, APPLICATION_DECISION } = require('../../constants');
const BusinessRulesError = require('../../lib/business-rules-error');

const householderDecisionDate = (decisionDate, decision) => {
  const appealType = APPEAL_ID.HOUSEHOLDER;

  switch (decision) {
    case APPLICATION_DECISION.GRANTED:
    case APPLICATION_DECISION.NODECISIONRECEIVED:
    case APPLICATION_DECISION.REFUSED:
      return add(endOfDay(decisionDate), {
        [appeal.type[appealType].appealDue[decision].duration]:
          appeal.type[appealType].appealDue[decision].time,
      });

    default:
      return add(endOfDay(decisionDate), {
        [appeal.type[appealType].appealDue.nodecisionreceived.duration]:
          appeal.type[appealType].appealDue.nodecisionreceived.time,
      });
  }
};

/**
 * @description Given an appeal's decision date, and an expiry period, determine the appeal's
 * deadline date.
 *
 * @param {Date} decisionDate
 * @param {Number} expiryPeriodInWeeks a positive number
 * @returns {Date}
 *
 * @throws {BusinessRulesError}
 */
module.exports = (decisionDate, appealType = APPEAL_ID.HOUSEHOLDER, decision) => {
  if (!isDateValid(decisionDate)) {
    throw new BusinessRulesError('The given date must be a valid Date instance');
  }

  if (!isValid(appealType)) {
    throw new BusinessRulesError(`${appealType} is not a valid appeal type`);
  }

  switch (appealType) {
    case APPEAL_ID.HOUSEHOLDER:
      return householderDecisionDate(decisionDate, decision);

    default:
      return add(endOfDay(decisionDate), {
        [appeal.type[appealType].appealDue.duration]: appeal.type[appealType].appealDue.time,
      });
  }
};
