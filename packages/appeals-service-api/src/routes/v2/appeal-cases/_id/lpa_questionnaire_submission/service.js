const { LPAQuestionnaireSubmissionRepository } = require('./repo');

const repo = new LPAQuestionnaireSubmissionRepository();

/**
 * @typedef {import("@prisma/client").LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

/**
 * Get Questionnaire for an appealCase
 *
 * @param {string} appealCaseId
 * @return {Promise<LPAQuestionnaireSubmission|null>}
 */
async function getLPAQuestionnaireByAppealId(appealCaseId) {
	const questionnaire = repo.getLPAQuestionnaireByAppealId(appealCaseId);

	if (!questionnaire) {
		return null;
	}

	return questionnaire;
}

/**
 * Create Questionnaire for an appealCase
 *
 * @param {string} appealCaseId
 * @return {Promise<LPAQuestionnaireSubmission|null>}
 */
async function createLPAQuestionnaire(appealCaseId) {
	const questionnaire = repo.createQuestionnaire(appealCaseId);

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
 * @return {Promise<LPAQuestionnaireSubmission|null>}
 */
async function putLPAQuestionnaireByAppealId(appealCaseId, data) {
	const questionnaire = repo.putLPAQuestionnaireByAppealId(appealCaseId, data);

	if (!questionnaire) {
		return null;
	}

	return questionnaire;
}

module.exports = {
	getLPAQuestionnaireByAppealId,
	createLPAQuestionnaire,
	putLPAQuestionnaireByAppealId
};
