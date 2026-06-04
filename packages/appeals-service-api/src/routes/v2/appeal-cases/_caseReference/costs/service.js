const { CostsRepository } = require('./repo');
const { appendAppellantAndAgent, appendLinkedCases } = require('../../service');
const ApiError = require('#errors/apiError');
const repo = new CostsRepository();

/**
 *
 * @param {string} caseReference
 * @param {string[]} types
 * @returns {Promise<import('./repo').AppealWithDocuments>}
 */
async function getAppealCaseWithCostsByType(caseReference, types) {
	const appealCaseWithDocuments = await repo.getAppealCaseWithCostsByType(caseReference, types);

	if (!appealCaseWithDocuments) throw ApiError.appealsCaseDataNotFound();

	const appealCaseWithApplicant = await appendAppellantAndAgent(appealCaseWithDocuments);

	const appealCaseWithLinkedCases = await appendLinkedCases(appealCaseWithApplicant);

	return appealCaseWithLinkedCases;
}

module.exports = {
	getAppealCaseWithCostsByType
};
