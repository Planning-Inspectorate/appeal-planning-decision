const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const { APPEALS_CASE_DATA } = require('@pins/common/src/constants');

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
		case APPEALS_CASE_DATA.APPEAL_TYPE_CODE.S78:
			return 'Full appeal';
		case APPEALS_CASE_DATA.APPEAL_TYPE_CODE.HAS:
			return 'Householder appeal';
		default:
			return '';
	}
};

const mapTypeCodeToAppealId = (typeCode) => {
	const typeCodeToAppealId = {
		[APPEALS_CASE_DATA.APPEAL_TYPE_CODE.HAS]: APPEAL_ID.HOUSEHOLDER,
		[APPEALS_CASE_DATA.APPEAL_TYPE_CODE.S78]: APPEAL_ID.PLANNING_SECTION_78
	};
	return typeCodeToAppealId[typeCode];
};

module.exports = {
	getAppealTypeName,
	getAppealTypeNameByTypeCode,
	mapPlanningApplication,
	mapTypeCodeToAppealId
};
