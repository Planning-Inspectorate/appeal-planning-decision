const { appeal } = require('../../../config');

/**
 * @description Determine if a given appeal type (appealType) is valid.
 *
 * @param {Date} appealType
 * @returns {boolean}
 */
module.exports = (appealType) => {
  return Object.keys(appeal.type).includes(appealType);
};
