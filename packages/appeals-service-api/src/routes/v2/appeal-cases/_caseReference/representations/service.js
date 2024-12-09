const { RepresentationsRepository } = require('./repo');
const repo = new RepresentationsRepository();
// const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');

/**
 * @typedef {import('@prisma/client').Representation} Representation
 */

/**
 *
 * @param {string} caseReference
 * @returns {Promise<Array<Representation>|null>}
 */
async function getAllRepresentationsForCase(caseReference) {
	return await repo.getAllRepresentationsForCase(caseReference);
}

/**
 *
 * @param {string} caseReference
 * @param {string} type
 * @returns {Promise<Array<Representation>|null>}
 */
async function getRepresentationsByTypeForCase(caseReference, type) {
	return await repo.getRepresentationsByTypeForCase(caseReference, type);
}

module.exports = { getAllRepresentationsForCase, getRepresentationsByTypeForCase };
4;
