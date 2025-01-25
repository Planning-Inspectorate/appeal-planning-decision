const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const mapPlanningApplication = (application) => {
	switch (application) {
		case 'full-appeal':
		case 'outline-planning':
		case 'prior-approval':
		case 'reserved-matters':
		case 'removal-or-variation-of-conditions':
			return APPEAL_ID.PLANNING_SECTION_78;

		case 'householder-planning':
			return APPEAL_ID.HOUSEHOLDER;

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
			return 'Full appeal';
		case CASE_TYPES.HAS.processCode:
			return 'Householder appeal';
		default:
			return '';
	}
};

module.exports = {
	getAppealTypeName,
	getAppealTypeNameByTypeCode,
	mapPlanningApplication
};
