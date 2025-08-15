const { APPEAL_ID, TYPE_OF_PLANNING_APPLICATION } = require('@pins/business-rules/src/constants');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

/** BYS
 * @param {string} application
 * @returns {string|undefined}
 */
const mapPlanningApplication = (application) => {
	switch (application) {
		case TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL:
		case TYPE_OF_PLANNING_APPLICATION.OUTLINE_PLANNING:
		case TYPE_OF_PLANNING_APPLICATION.PRIOR_APPROVAL:
		case TYPE_OF_PLANNING_APPLICATION.RESERVED_MATTERS:
		case TYPE_OF_PLANNING_APPLICATION.REMOVAL_OR_VARIATION_OF_CONDITIONS:
			return APPEAL_ID.PLANNING_SECTION_78;

		case TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING:
			return APPEAL_ID.HOUSEHOLDER;

		case TYPE_OF_PLANNING_APPLICATION.LISTED_BUILDING:
			return APPEAL_ID.PLANNING_LISTED_BUILDING;

		case TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT:
			return APPEAL_ID.MINOR_COMMERCIAL;
		case TYPE_OF_PLANNING_APPLICATION.ADVERTISEMENT:
			return APPEAL_ID.ADVERTISEMENT;

		default:
			return undefined;
	}
};

/** DASHBOARD (v1)
 * @param {string} appealId
 * @returns {string}
 */
const getAppealTypeName = (appealId) => {
	switch (appealId) {
		case APPEAL_ID.PLANNING_SECTION_78:
			return 'Full appeal';
		case APPEAL_ID.HOUSEHOLDER:
			return 'Householder appeal';
		default:
			return '';
	}
};

/**
 * @type {Object.<string, string>}
 */
const typeOfPlanningApplicationToAppealTypeMapper = {
	[TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL]: CASE_TYPES.S78.processCode,
	[TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING]: CASE_TYPES.HAS.processCode,
	[TYPE_OF_PLANNING_APPLICATION.LISTED_BUILDING]: CASE_TYPES.S20.processCode
};

module.exports = {
	getAppealTypeName,
	mapPlanningApplication,
	typeOfPlanningApplicationToAppealTypeMapper
};
