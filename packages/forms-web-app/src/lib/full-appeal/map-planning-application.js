const { APPEAL_ID, TYPE_OF_PLANNING_APPLICATION } = require('@pins/business-rules/src/constants');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

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

		default:
			return undefined;
	}
};

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

const getAppealTypeNameByTypeCode = (typeCode) => {
	switch (typeCode) {
		case CASE_TYPES.S78.processCode:
			return 'Planning appeal';
		case CASE_TYPES.HAS.processCode:
			return 'Householder appeal';
		case CASE_TYPES.S20.processCode:
			return 'Planning Listed Building appeal';
		default:
			return '';
	}
};

module.exports = {
	getAppealTypeName,
	getAppealTypeNameByTypeCode,
	mapPlanningApplication
};
