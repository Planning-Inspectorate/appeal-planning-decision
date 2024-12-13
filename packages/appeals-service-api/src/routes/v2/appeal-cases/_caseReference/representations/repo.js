const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').AppealCase} AppealCase
 */
class RepresentationsRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get all representations for a given case reference
	 *
	 * @param {string} caseReference
	 * @returns {Promise<AppealCase|null>}
	 */
	async getAppealCaseWithAllRepresentations(caseReference) {
		try {
			// @ts-ignore
			return await this.dbClient.appealCase.findUnique({
				where: {
					caseReference
				},
				select: {
					caseReference: true,
					LPACode: true,
					applicationReference: true,
					caseProcedure: true,
					appealTypeCode: true,
					siteAddressLine1: true,
					siteAddressLine2: true,
					siteAddressTown: true,
					siteAddressCounty: true,
					siteAddressPostcode: true,
					Representations: {
						include: {
							RepresentationDocuments: true
						}
					}
				}
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}

	/**
	 * Get representations of a given type for a given case reference
	 *
	 * @param {string} caseReference
	 * @param {string} type
	 * @returns {Promise<AppealCase|null>}
	 */
	async getAppealCaseWithRepresentationsByType(caseReference, type) {
		try {
			// @ts-ignore
			return await this.dbClient.appealCase.findUnique({
				where: {
					caseReference
				},
				select: {
					LPACode: true,
					applicationReference: true,
					caseReference: true,
					caseProcedure: true,
					appealTypeCode: true,
					siteAddressLine1: true,
					siteAddressLine2: true,
					siteAddressTown: true,
					siteAddressCounty: true,
					siteAddressPostcode: true,
					Representations: {
						where: {
							representationType: type
						},
						include: {
							RepresentationDocuments: true
						}
					}
				}
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}
}

module.exports = { RepresentationsRepository };
