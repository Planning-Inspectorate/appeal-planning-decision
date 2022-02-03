const { isBefore, endOfDay, sub } = require('date-fns');
const businessRules = require('../../../rules');
const isValid = require('../../generic/date/is-valid');
const { APPEAL_ID } = require('../../../constants');

/**
 * @description Given a starting point (givenDate), determine the deadline date, and whether
 * today (now) is within the decision date expiration period.
 *
 * @param {Date} givenDate
 * @param {Date} now
 * @returns {boolean}
 */
module.exports = (givenDate, appealType = APPEAL_ID.HOUSEHOLDER, now = new Date()) => {
  [givenDate, now].forEach(isValid);

  const yesterday = sub(endOfDay(now), {
    days: 1,
  });
  const deadlineDate = businessRules.appeal.deadlineDate(givenDate, appealType);

  return isBefore(yesterday, deadlineDate);
};
