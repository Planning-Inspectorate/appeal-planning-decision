const { caseTypeLookup } = require('@pins/common/src/database/data-static');
const {
	formatter: representationFormatter
} = require('../../../../services/back-office-v2/formatters/representation');

/**
 * @typedef {import('../../../../services/back-office-v2/formatters/representation').TypedRepresentationSubmission} TypedRepresentationSubmission
 * @typedef {import('../../../../services/back-office-v2/formatters/representation').RepresentationTypes} RepresentationTypes
 *
 */

/**
 * @param {string|null} appealTypeCode
 * @returns {function(string, string | null, RepresentationTypes, TypedRepresentationSubmission): *}
 */
const getFormatter = (appealTypeCode) => {
	if (caseTypeLookup(appealTypeCode).expedited === false) return representationFormatter;
	else throw new Error('unknown formatter');
};

module.exports = { getFormatter };
