const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').AppealStatement} AppealStatement
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
	 * @returns {Promise<Array<AppealStatement>|null>}
	 */
	async getAllRepresentationsForCase(caseReference) {
		try {
			return await this.dbClient.representation.findMany({
				where: {
					caseReference
				},
				include: {
					AppealCase: {
						select: {
							LPACode: true,
							applicationReference: true,
							caseProcedure: true,
							appealTypeCode: true,
							siteAddressLine1: true,
							siteAddressLine2: true,
							siteAddressTown: true,
							siteAddressCounty: true,
							siteAddressPostcode: true
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
	 * @returns {Promise<Array<AppealStatement>|null>}
	 */
	async getRepresentationsByTypeForCase(caseReference, type) {
		try {
			return await this.dbClient.representation.findMany({
				where: {
					caseReference,
					representationType: type
				},
				include: {
					AppealCase: {
						select: {
							LPACode: true,
							applicationReference: true,
							caseProcedure: true,
							appealTypeCode: true,
							siteAddressLine1: true,
							siteAddressLine2: true,
							siteAddressTown: true,
							siteAddressCounty: true,
							siteAddressPostcode: true
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
