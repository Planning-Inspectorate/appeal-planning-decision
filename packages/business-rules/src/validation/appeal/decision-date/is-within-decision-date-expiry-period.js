const { isBefore, endOfDay, sub } = require('date-fns');
const businessRules = require('../../../rules');
const isValid = require('../../generic/date/is-valid');
const { APPEAL_ID, APPLICATION_DECISION } = require('../../../constants');

/**
 * @description Given a starting point (givenDate), determine the deadline date, and whether
 * today (now) is within the decision date expiration period.
 *
 * @param {Date} givenDate
 * @param {string} appealType
 * @param {string} applicationDecision
 * @param {Date} now
 * @returns {boolean}
 */
module.exports = (givenDate, appealType, applicationDecision, now = new Date()) => {
  [givenDate, now].forEach(isValid);

  const yesterday = sub(endOfDay(now), {
    days: 1,
  });
  const deadlineDate = businessRules.appeal.deadlineDate(
    givenDate,
    appealType,
    applicationDecision,
  );

  return isBefore(yesterday, deadlineDate);
};
