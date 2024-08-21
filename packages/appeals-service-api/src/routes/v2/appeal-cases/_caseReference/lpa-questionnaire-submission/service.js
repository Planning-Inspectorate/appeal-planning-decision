const { LPAQuestionnaireSubmissionRepository } = require('./repo');

const repo = new LPAQuestionnaireSubmissionRepository();

/**
 * @typedef {import('./questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

/**
 * Get Questionnaire for an appealCase
 *
 * @param {string} appealCaseId
 * @return {Promise<LPAQuestionnaireSubmission|null>}
 */
async function getLPAQuestionnaireByAppealId(appealCaseId) {
	const questionnaire = await repo.getLPAQuestionnaireByAppealRef(appealCaseId);

	if (!questionnaire) {
		return null;
	}

	return questionnaire;
}

/**
 * Create Questionnaire for an appealCase
 *
 * @param {string} appealCaseId
 * @returns {Promise<Omit<LPAQuestionnaireSubmission, 'SubmissionDocumentUpload' | 'SubmissionAddress'> | null>}
 */
async function createLPAQuestionnaire(appealCaseId) {
	const questionnaire = await repo.createQuestionnaire(appealCaseId);

	if (!questionnaire) {
		return null;
	}

	return questionnaire;
}

/**
 * Put Questionnaire for an appealCase
 *
 * @param {string} appealCaseId
 * @param {LPAQuestionnaireSubmission} data
 * @returns {Promise<Omit<LPAQuestionnaireSubmission, 'SubmissionDocumentUpload' | 'SubmissionAddress'> | null>}
 */
async function patchLPAQuestionnaireByAppealId(appealCaseId, data) {
	const questionnaire = await repo.patchLPAQuestionnaireByAppealId(appealCaseId, data);

	if (!questionnaire) {
		return null;
	}

	return questionnaire;
}

/**
 * mark questionnaire as submitted to back office
 *
 * @param {string} caseReference
 * @param {string} lpaQuestionnaireSubmittedDate
 * @return {Promise<{id: string}>}
 */
function markQuestionnaireAsSubmitted(caseReference, lpaQuestionnaireSubmittedDate) {
	return repo.markLPAQuestionnaireAsSubmitted(caseReference, lpaQuestionnaireSubmittedDate);
}

module.exports = {
	getLPAQuestionnaireByAppealId,
	createLPAQuestionnaire,
	patchLPAQuestionnaireByAppealId,
	markQuestionnaireAsSubmitted
};
