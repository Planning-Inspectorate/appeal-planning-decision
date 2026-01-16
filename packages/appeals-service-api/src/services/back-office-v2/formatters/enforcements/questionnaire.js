/**
 * @typedef {import('../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 */

const {
	getDocuments,
	getCommonLPAQSubmissionFields,
	getEnforcementSpecificLPAQSubmissionFields,
	getHASLPAQSubmissionFields,
	getEIAFields,
	getLPAProcedurePreference,
	getCommonSiteDesignationAndProtectionFields,
	getInfrastructureLevy,
	getChangedListedBuildingNumbersFields
} = require('../utils');
const { documentTypes } = require('@pins/common/src/document-types');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const ENFORCEMENT = CASE_TYPES.ENFORCEMENT.key;

/**
 * @param {string} caseReference
 * @param {LPAQuestionnaireSubmission} questionnaireResponse
 * @returns {Promise<LPAQuestionnaireCommand>}
 */
exports.formatter = async (caseReference, { ...answers }) => {
	return {
		casedata: {
			caseType: ENFORCEMENT,
			...getCommonLPAQSubmissionFields(caseReference, answers),
			...getHASLPAQSubmissionFields(answers),
			...getEIAFields(answers),
			...getLPAProcedurePreference(answers),
			...getCommonSiteDesignationAndProtectionFields(answers),
			...getInfrastructureLevy(answers),
			...getChangedListedBuildingNumbersFields(answers),
			...getEnforcementSpecificLPAQSubmissionFields(answers)
		},
		documents: await getDocuments(answers, documentTypes.planningOfficersReportUpload.dataModelName)
	};
};
