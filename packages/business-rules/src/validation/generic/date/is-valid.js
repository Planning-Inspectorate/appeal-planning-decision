const { isValid } = require('date-fns');

/**
 * @description a very thin wrapper over date-fns/is-valid.
 *
 * @param {Date} givenDate
 * @returns {boolean}
 */
module.exports = (givenDate) => {
  if (!isValid(givenDate)) {
    throw new Error('The given date must be a valid Date instance');
  }

  return true;
};
