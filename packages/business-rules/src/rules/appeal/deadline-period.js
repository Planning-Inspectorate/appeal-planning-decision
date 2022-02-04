const { appeal } = require('../../config');
const isValid = require('../../validation/appeal/type/is-valid');
const { APPEAL_ID, APPLICATION_DECISION } = require('../../constants');
const BusinessRulesError = require('../../lib/business-rules-error');

const householderDecisionPeriod = (decision) => {
  const appealType = APPEAL_ID.HOUSEHOLDER;

  switch (decision) {
    case APPLICATION_DECISION.GRANTED:
    case APPLICATION_DECISION.NODECISIONRECEIVED:
    case APPLICATION_DECISION.REFUSED:
      return {
        duration: appeal.type[appealType].appealDue[decision].duration,
        time: appeal.type[appealType].appealDue[decision].time,
      };

    default:
      return {
        duration: appeal.type[appealType].appealDue.nodecisionreceived.duration,
        time: appeal.type[appealType].appealDue.nodecisionreceived.time,
      };
  }
};

/**
 * @description Determine the appeal's deadline period.
 *
 * @param {Number} expiryPeriodInWeeks a positive number
 *
 * @throws {BusinessRulesError}
 */
module.exports = (appealType = APPEAL_ID.HOUSEHOLDER, decision) => {
  if (!isValid(appealType)) {
    throw new BusinessRulesError(`${appealType} is not a valid appeal type`);
  }

  switch (appealType) {
    case APPEAL_ID.HOUSEHOLDER:
      return householderDecisionPeriod(decision);

    default:
      return {
        duration: appeal.type[appealType].appealDue.duration,
        time: appeal.type[appealType].appealDue.time,
      };
  }
};
