/**
 * @typedef {import('../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 */

const { getDocuments, getCommonLPAQSubmissionFields } = require('../utils');
const { documentTypes } = require('@pins/common/src/document-types');
const { CASE_TYPES: LDC } = require('@pins/common/src/database/data-static');

/**
 * @param {string} caseReference
 * @param {LPAQuestionnaireSubmission} questionnaireResponse
 * @returns {Promise<LPAQuestionnaireCommand>}
 */
exports.formatter = async (caseReference, { ...answers }) => {
	return {
		casedata: {
			// Root
			caseType: LDC.key,
			// Common
			...getCommonLPAQSubmissionFields(caseReference, answers)
		},
		documents: await getDocuments(answers, documentTypes.planningOfficersReportUpload.dataModelName)
	};
};
