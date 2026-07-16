const { createPrismaClient } = require('#db-client');

const { DocumentsArgs } = require('../../repo');

/**
 * @typedef {import('@pins/database/src/client/client').Document} Document
 */
class AppealDocumentRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get event for given appeal
	 *
	 * @param {string} caseReference
	 * @param {Array<string> | undefined} [documentTypes]
	 * @returns {Promise<Array<Document>>}
	 */
	getDocumentsByAppealRef(caseReference, documentTypes) {
		/** @type {import('@pins/database/src/client/client').Prisma.DocumentWhereInput} */
		const where = {
			caseReference: caseReference,
			published: true
		};

		if (documentTypes && documentTypes?.length > 0) {
			where.documentType = {
				in: documentTypes
			};
		}

		return this.dbClient.document.findMany({
			...DocumentsArgs,
			where: where
		});
	}
}

module.exports = { AppealDocumentRepository };
