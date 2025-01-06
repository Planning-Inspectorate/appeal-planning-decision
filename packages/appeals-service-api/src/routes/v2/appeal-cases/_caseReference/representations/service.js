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

module.exports = {
	getAppealCaseWithAllRepresentations,
	getAppealCaseWithRepresentationsByType
};
