const { addWeeks, endOfDay, isValid } = require('date-fns');

/**
 * @description Given an appeal's decision date, and an expiry period, determine the appeal's
 * deadline date.
 *
 * @param {Date} decisionDate
 * @param {Number} expiryPeriodInWeeks a positive number
 * @returns {Date}
 *
 * @throws {Error}
 */
module.exports = (decisionDate, expiryPeriodInWeeks = 12) => {
  if (!isValid(decisionDate)) {
    throw new Error('The given date must be a valid Date instance.');
  }

  if (Number.isInteger(expiryPeriodInWeeks) === false || expiryPeriodInWeeks < 0) {
    throw new Error(`The 'expiryPeriodInWeeks' parameter must be a positive number.`);
  }

  return addWeeks(endOfDay(decisionDate), expiryPeriodInWeeks);
};
