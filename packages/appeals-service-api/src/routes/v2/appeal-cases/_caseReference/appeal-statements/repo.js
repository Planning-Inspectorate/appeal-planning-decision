const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');
const { IndirectDocumentsArgsPublishedOnly } = require('../appeal-final-comments/repo');

/**
 * @typedef {import('@prisma/client').AppealStatement} AppealStatement
 */
class AppealStatementRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get lpa statement for a given case reference
	 *
	 * @param {string} caseReference
	 * @returns {Promise<Array<AppealStatement>|null>}
	 */
	async getLPAStatement(caseReference) {
		try {
			return await this.dbClient.appealStatement.findMany({
				where: {
					caseReference,
					lpaCode: { not: null }
				},
				include: {
					StatementDocuments: IndirectDocumentsArgsPublishedOnly
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
	 * Get rule 6 party statements for a given case reference
	 *
	 * @param {string} caseReference
	 * @returns {Promise<Array<AppealStatement>|null>}
	 */
	async getRule6Statements(caseReference) {
		try {
			return await this.dbClient.appealStatement.findMany({
				where: {
					caseReference,
					serviceUserId: { not: null }
				},
				include: {
					StatementDocuments: IndirectDocumentsArgsPublishedOnly
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

module.exports = { AppealStatementRepository };
