const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const { APPEALS_CASE_DATA } = require('../constants');

/**
 *
 * @param {string} typeCode
 * @returns {string}
 */
const mapTypeCodeToAppealId = (typeCode) => {
	const typeCodeToAppealId = {
		[APPEALS_CASE_DATA.APPEAL_TYPE_CODE.HAS]: APPEAL_ID.HOUSEHOLDER,
		[APPEALS_CASE_DATA.APPEAL_TYPE_CODE.S78]: APPEAL_ID.PLANNING_SECTION_78
	};
	return typeCodeToAppealId[typeCode];
};

module.exports = { mapTypeCodeToAppealId };
