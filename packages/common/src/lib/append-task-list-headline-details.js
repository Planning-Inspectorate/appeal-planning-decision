const { caseTypeNameWithDefault } = require('./format-case-type');
const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {AppealCaseDetailed & { appealTypeName?: string, appellantFirstName?: string | null | undefined, appellantLastName?: string | null | undefined, detailsName?: string}} AppealCaseDetailedWithTaskListDetails
 */

/**
 * @param {AppealCaseDetailedWithTaskListDetails} appeal
 * @returns {void}
 */
const appendTaskListHeadlineDetails = (appeal) => {
	appeal.appealTypeName = caseTypeNameWithDefault(appeal.appealTypeCode);
	const appellant = appeal.users?.find((x) => x.serviceUserType === SERVICE_USER_TYPE.APPELLANT);
	if (appellant) {
		appeal.appellantFirstName = appellant.firstName;
		appeal.appellantLastName = appellant.lastName;
		if (!appellant.firstName && !appellant.lastName && appellant.organisation) {
			appeal.detailsName = appellant.organisation;
		} else {
			appeal.detailsName = `${appellant.firstName} ${appellant.lastName}`;
		}
	}
};

module.exports = { appendTaskListHeadlineDetails };
