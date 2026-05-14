const { appeal } = require('../../../config');

/**
 * @description Determine if a given appeal type (appealType) is valid.
 *
 * @param {string} appealType
 * @returns {boolean}
 */
module.exports = (appealType) => {
	return Object.keys(appeal.type).includes(appealType);
};
