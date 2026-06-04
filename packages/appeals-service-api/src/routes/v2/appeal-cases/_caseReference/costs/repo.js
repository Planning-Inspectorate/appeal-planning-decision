const { createPrismaClient } = require('#db-client');
const { Prisma } = require('@pins/database/src/client/client');
const { dashboardSelect, DocumentsArgs } = require('../../repo');

/**
 * @typedef {import('@pins/database/src/client/client').AppealCase} AppealCase
 * @typedef {import('@pins/database/src/client/client').Document} Document
 * @typedef {AppealCase & { Documents?: Array.<Document>}} AppealWithDocuments
 */

class CostsRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get all costs for a given case reference
	 *
	 * @param {string} caseReference
	 * @param {string[]} costTypes
	 * @returns {Promise<AppealWithRepresentations|null>}
	 */
	async getAppealCaseWithCostsByType(caseReference, costTypes) {
		try {
			return await this.dbClient.appealCase.findUnique({
				where: {
					caseReference
				},
				select: {
					...dashboardSelect,
					Documents: {
						...DocumentsArgs,
						where: {
							documentType: {
								in: costTypes
							}
						}
					}
				}
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}
}

module.exports = { CostsRepository };
