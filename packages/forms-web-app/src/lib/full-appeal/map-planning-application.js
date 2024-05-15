const { APPEAL_ID, TYPE_CODE } = require('@pins/business-rules/src/constants');

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
		case TYPE_CODE.PLANNING_SECTION_78:
			return 'Full appeal';
		case TYPE_CODE.HOUSEHOLDER:
			return 'Householder appeal';
		default:
			return '';
	}
};

const mapTypeCodeToAppealId = (typeCode) => {
	const typeCodeToAppealId = {
		[TYPE_CODE.HOUSEHOLDER]: APPEAL_ID.HOUSEHOLDER,
		[TYPE_CODE.PLANNING_SECTION_78]: APPEAL_ID.PLANNING_SECTION_78
	};
	return typeCodeToAppealId[typeCode];
};

module.exports = {
	getAppealTypeName,
	getAppealTypeNameByTypeCode,
	mapPlanningApplication,
	mapTypeCodeToAppealId
};
