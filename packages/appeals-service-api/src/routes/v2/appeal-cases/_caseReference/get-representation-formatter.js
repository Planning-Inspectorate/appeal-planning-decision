const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	formatter: s78s20Formatter
} = require('../../../../services/back-office-v2/formatters/s78s20/representation');

/**
 * @typedef {import('../../../../services/back-office-v2/formatters/s78s20/representation').TypedRepresentationSubmission} TypedRepresentationSubmission
 * @typedef {import('../../../../services/back-office-v2/formatters/s78s20/representation').RepresentationTypes} RepresentationTypes
 *
 */

/**
 * @param {string|null} appealTypeCode
 * @returns {function(string, string | null, RepresentationTypes, TypedRepresentationSubmission): *}
 */
const getFormatter = (appealTypeCode) => {
	switch (appealTypeCode) {
		case CASE_TYPES.S78.processCode:
		case CASE_TYPES.S20.processCode:
			return s78s20Formatter;
		default:
			throw new Error('unknown formatter');
	}
};

module.exports = { getFormatter };
