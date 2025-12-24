/**
 * @typedef {import('../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 */

const {
	getDocuments,
	getCommonLPAQSubmissionFields,
	getEnforcementLPAQSubmissionFields,
	getS78LPAQSubmissionFields,
	getHASLPAQSubmissionFields
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
			...getS78LPAQSubmissionFields(answers),
			...getEnforcementLPAQSubmissionFields(answers)
		},
		documents: await getDocuments(answers, documentTypes.planningOfficersReportUpload.dataModelName)
	};
};
