const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { linkUserToAppeal } = require('../../routes/v2/users/service');
const { createAppeal } = require('../../routes/v2/appeals/service');

/**
 * @param {import ('@planning-inspectorate/data-model').Schemas.AppellantSubmissionCommand} mappedData
 * @param {string} userId
 */
const createEnforcementNamedIndividualAppeals = async (mappedData, userId) => {
	const { caseType, namedIndividuals, submissionId } = mappedData.casedata;

	if (!caseType || caseType !== CASE_TYPES.ENFORCEMENT.key) return;

	if (!namedIndividuals || !Array.isArray(namedIndividuals) || namedIndividuals.length === 0)
		return;

	for (let i = 0; i < namedIndividuals.length; i++) {
		const appeal = await createAppeal({ leadAppellantSubmissionId: submissionId });

		await linkUserToAppeal(userId, appeal.id, APPEAL_USER_ROLES.AGENT);
	}
};

module.exports = { createEnforcementNamedIndividualAppeals };
