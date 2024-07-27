const { CASE_TYPES } = require('../database/data-static');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 */

/**
 * @param {string|undefined|null} appealTypeCode
 * @returns {string}
 */
const caseTypeNameWithDefault = (appealTypeCode) => {
	if (!appealTypeCode) return '';

	return appealTypeCode in CASE_TYPES ? CASE_TYPES[appealTypeCode]?.type : '';
};

module.exports = {
	caseTypeNameWithDefault
};
