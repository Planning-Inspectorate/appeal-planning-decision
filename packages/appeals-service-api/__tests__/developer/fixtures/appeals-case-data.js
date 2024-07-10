const { APPEAL_CASE_STATUS } = require('pins-data-model');

/**
 * @param {string} caseRef
 * @param {string} caseType
 * @param {string} lpaCode
 * @param {string} postCode
 * @param {boolean} casePublished
 * @returns {import('@prisma/client').Prisma.AppealCaseCreateWithoutAppealInput}
 */
function createTestAppealCase(
	caseRef,
	caseType,
	lpaCode,
	postCode = 'POST CODE',
	casePublished = true
) {
	const now = new Date();
	const publishedDate = casePublished ? now : null;

	return {
		caseReference: caseRef,
		applicationReference: caseRef + 'APP',
		applicationDecisionDate: now,
		CaseType: { connect: { processCode: caseType } },
		applicationDecision: 'refused',
		siteAddressLine1: '123 Fake Street',
		siteAddressTown: 'Testville',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: postCode,
		appellantCostsAppliedFor: false,
		LPACode: lpaCode,
		casePublishedDate: publishedDate,
		caseDecisionPublishedDate: null,
		caseCreatedDate: now,
		caseSubmittedDate: now,
		CaseStatus: {
			connect: { key: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE }
		}
	};
}

module.exports = { createTestAppealCase };
