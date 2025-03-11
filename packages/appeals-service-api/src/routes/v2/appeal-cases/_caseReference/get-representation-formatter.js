const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	formatter: s78Formatter
} = require('../../../../services/back-office-v2/formatters/s78/representation');

/**
 * @typedef {import('../../../../services/back-office-v2/formatters/s78/representation').TypedRepresentationSubmission} TypedRepresentationSubmission
 * @typedef {import('../../../../services/back-office-v2/formatters/s78/representation').RepresentationTypes} RepresentationTypes
 *
 */

/**
 * @param {string|null} appealTypeCode
 * @returns {function(string, string | null, RepresentationTypes, TypedRepresentationSubmission): *}
 */
const getFormatter = (appealTypeCode) => {
	switch (appealTypeCode) {
		case CASE_TYPES.S78.processCode:
			return s78Formatter;
		default:
			throw new Error('unknown formatter');
	}
};

module.exports = { getFormatter };
