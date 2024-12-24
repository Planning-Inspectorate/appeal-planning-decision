const { RepresentationsRepository } = require('./repo');
const { appendAppellantAndAgent } = require('../../service');
const repo = new RepresentationsRepository();

/**
 * @typedef {import('@prisma/client').AppealCase} AppealCase
 */

/**
 *
 * @param {string} caseReference
 * @returns {Promise<AppealCase|null>}
 */
async function getAppealCaseWithAllRepresentations(caseReference) {
	const appealCaseWithRepresentations = await repo.getAppealCaseWithAllRepresentations(
		caseReference
	);

	// @ts-ignore
	const appealCaseWithApplicant = await appendAppellantAndAgent(appealCaseWithRepresentations);

	return appealCaseWithApplicant;
}

/**
 *
 * @param {string} caseReference
 * @param {string} type
 * @returns {Promise<AppealCase|null>}
 */
async function getAppealCaseWithRepresentationsByType(caseReference, type) {
	const appealCaseWithRepresentations = await repo.getAppealCaseWithRepresentationsByType(
		caseReference,
		type
	);

	// @ts-ignore
	const appealCaseWithApplicant = await appendAppellantAndAgent(appealCaseWithRepresentations);

	return appealCaseWithApplicant;
}

/**
 *
 * @param {AppealCase} caseData
 * @param  {string} userId
 * @param {'own' | 'otherParties'} rule6Parties
 */
async function filterRule6Representations(caseData, userId, rule6Parties) {
	// if (rule6Parties === 'own') {

	// }

	return `${caseData.appealTypeCode} ${userId} ${rule6Parties}`;
}

module.exports = {
	getAppealCaseWithAllRepresentations,
	getAppealCaseWithRepresentationsByType,
	filterRule6Representations
};
