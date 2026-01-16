/**
 * @typedef {import('../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 */

const {
	getDocuments,
	getCommonLPAQSubmissionFields,
	getHASLPAQSubmissionFields,
	getS20LPAQSubmissionFields,
	getEIAFields,
	getInfrastructureLevy,
	getCommonSiteDesignationAndProtectionFields,
	getLPAProcedurePreference
} = require('../utils');
const { documentTypes } = require('@pins/common/src/document-types');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const S20 = CASE_TYPES.S20.key;

/**
 * @param {string} caseReference
 * @param {LPAQuestionnaireSubmission} questionnaireResponse
 * @returns {Promise<LPAQuestionnaireCommand>}
 */
exports.formatter = async (caseReference, { ...answers }) => {
	return {
		casedata: {
			// Root
			caseType: S20,
			// Common
			...getCommonLPAQSubmissionFields(caseReference, answers),
			// HAS
			...getHASLPAQSubmissionFields(answers),
			// S20
			...getS20LPAQSubmissionFields(answers),
			...getEIAFields(answers),
			...getInfrastructureLevy(answers),
			...getCommonSiteDesignationAndProtectionFields(answers),
			...getLPAProcedurePreference(answers)
		},
		documents: await getDocuments(answers, documentTypes.planningOfficersReportUpload.dataModelName)
	};
};
