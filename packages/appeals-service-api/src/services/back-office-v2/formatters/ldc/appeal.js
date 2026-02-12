const {
	formatApplicationSubmissionUsers,
	formatPlanningObligationStatus,
	getAppellantProcedurePreference,
	getCommonAppellantSubmissionFields,
	getDocuments,
	getLdcSpecificAppealSubmissionFields
} = require('../utils');
const {
	CASE_TYPES: { LDC }
} = require('@pins/common/src/database/data-static');
const {
	APPEAL_APPLICATION_MADE_UNDER_ACT_SECTION,
	APPEAL_DOCUMENT_TYPE
} = require('@planning-inspectorate/data-model');

/**
 * @type {import('../utils').AppellantSubmissionMapper}
 */
exports.formatter = async (appellantSubmission, lpa) => {
	const result = {
		casedata: {
			caseType: LDC.key,
			...getCommonAppellantSubmissionFields(appellantSubmission, lpa),
			...getAppellantProcedurePreference(appellantSubmission),
			...getLdcSpecificAppealSubmissionFields(appellantSubmission),
			planningObligation: appellantSubmission.planningObligation ?? null,
			statusPlanningObligation: formatPlanningObligationStatus(
				appellantSubmission.statusPlanningObligation
			)
		},
		documents: await getDocuments(appellantSubmission),
		users: formatApplicationSubmissionUsers(appellantSubmission)
	};

	// remove conditional fields if present
	if (
		appellantSubmission.applicationMadeUnderActSection ===
		APPEAL_APPLICATION_MADE_UNDER_ACT_SECTION.EXISTING_DEVELOPMENT
	) {
		result.casedata.originalDevelopmentDescription = null;
		result.documents = result.documents.filter(
			(doc) => doc.documentType !== APPEAL_DOCUMENT_TYPE.CHANGED_DESCRIPTION
		);
	}

	return result;
};
