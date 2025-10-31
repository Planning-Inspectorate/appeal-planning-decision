/**
 * @typedef {import('../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 */

const {
	getDocuments,
	getCommonLPAQSubmissionFields,
	getHASLPAQSubmissionFields,
	getCASAdvertsLPAQSubmissionFields,
	getAdvertsLPAQSubmissionFields
} = require('../utils');
const { documentTypes } = require('@pins/common/src/document-types');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const ADVERTS = CASE_TYPES.ADVERTS.key;

/**
 * @param {string} caseReference
 * @param {LPAQuestionnaireSubmission} questionnaireResponse
 * @returns {Promise<LPAQuestionnaireCommand>}
 */
exports.formatter = async (caseReference, { ...answers }) => {
	return {
		casedata: {
			// Root
			caseType: ADVERTS,
			// Common
			...getCommonLPAQSubmissionFields(caseReference, answers),
			// HAS
			...getHASLPAQSubmissionFields(answers),
			// CAS Adverts specific fields
			...getCASAdvertsLPAQSubmissionFields(answers),
			// Adverts specific fields
			...getAdvertsLPAQSubmissionFields(answers)
		},
		documents: await getDocuments(answers, documentTypes.planningOfficersReportUpload.dataModelName)
	};
};
