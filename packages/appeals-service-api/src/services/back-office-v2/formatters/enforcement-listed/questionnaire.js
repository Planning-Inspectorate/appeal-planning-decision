/**
 * @typedef {import('../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 */

const {
	getDocuments,
	getCommonLPAQSubmissionFields,
	getHASLPAQSubmissionFields,
	getEIAFields,
	getLPAProcedurePreference,
	getCommonSiteDesignationAndProtectionFields,
	getInfrastructureLevy,
	getChangedListedBuildingNumbersFields,
	getEnforcementCommonLPAQSubmissionFields
} = require('../utils');
const { documentTypes } = require('@pins/common/src/document-types');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const ENFORCEMENT_LISTED = CASE_TYPES.ENFORCEMENT_LISTED.key;

/**
 * @param {string} caseReference
 * @param {LPAQuestionnaireSubmission} questionnaireResponse
 * @returns {Promise<LPAQuestionnaireCommand>}
 */
exports.formatter = async (caseReference, { ...answers }) => {
	return {
		casedata: {
			caseType: ENFORCEMENT_LISTED,
			...getCommonLPAQSubmissionFields(caseReference, answers),
			...getHASLPAQSubmissionFields(answers),
			...getEIAFields(answers, true),
			...getLPAProcedurePreference(answers),
			...getCommonSiteDesignationAndProtectionFields(answers),
			...getInfrastructureLevy(answers),
			...getChangedListedBuildingNumbersFields(answers),
			...getEnforcementCommonLPAQSubmissionFields(answers),

			// ELB specific fields
			preserveGrantLoan: answers.section3aGrant ?? null,
			consultHistoricEngland: answers.consultHistoricEngland ?? null
		},
		documents: await getDocuments(answers, documentTypes.planningOfficersReportUpload.dataModelName)
	};
};
