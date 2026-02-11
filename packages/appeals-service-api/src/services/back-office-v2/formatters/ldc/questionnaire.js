/**
 * @typedef {import('../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 */

const {
	getDocuments,
	getCommonLPAQSubmissionFields,
	getHASLPAQSubmissionFields,
	getLPAProcedurePreference,
	getInfrastructureLevy,
	getLdcSpecificLPAQSubmissionFields
} = require('../utils');
const { documentTypes } = require('@pins/common/src/document-types');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const LDC = CASE_TYPES.LDC.key;

/**
 * @param {string} caseReference
 * @param {LPAQuestionnaireSubmission} questionnaireResponse
 * @returns {Promise<LPAQuestionnaireCommand>}
 */
exports.formatter = async (caseReference, { ...answers }) => {
	return {
		casedata: {
			// Root
			caseType: LDC,
			// Common
			...getCommonLPAQSubmissionFields(caseReference, answers),
			// HAS
			...getHASLPAQSubmissionFields(answers),
			// Other
			...getLPAProcedurePreference(answers),
			...getInfrastructureLevy(answers),
			// LDC specific
			...getLdcSpecificLPAQSubmissionFields(answers)
		},
		documents: await getDocuments(answers, documentTypes.planningOfficersReportUpload.dataModelName)
	};
};
