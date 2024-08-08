const { CASE_TYPES } = require('./database/data-static');

/**
 *
 * @param {string} typeCode
 * @returns {string}
 */
const mapTypeCodeToAppealId = (typeCode) => {
	const caseType = CASE_TYPES[typeCode];
	if (!caseType) {
		throw new Error(`Unknown case type code: ${typeCode}`);
	}

	return caseType.id.toString();
};

module.exports = { mapTypeCodeToAppealId };
