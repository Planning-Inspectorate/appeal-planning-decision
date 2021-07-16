const { isAfter, endOfDay } = require('date-fns');
const isValid = require('./is-valid');

/**
 * @description
 * <p>Checks if the givenDate is in the past according to the Date of 'now'.</p>
 *
 * <p>'now' can be explicitly overridden, or will default to today.</p>
 *
 * <p><b style="color: red;">Important</b>: any valid time until the end of today is considered to be in the past.</p>
 *
 * @param {Date} givenDate
 * @param {Date} now
 * @returns {boolean}
 *
 * @throws {Error} if the givenDate or now value are invalid.
 */
module.exports = (givenDate, now = new Date()) => {
  [givenDate, now].forEach(isValid);

  const today = endOfDay(now);

  return !isAfter(givenDate, today);
};
