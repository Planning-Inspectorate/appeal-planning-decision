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

module.exports = {
	getLPAQuestionnaireByAppealId
};
