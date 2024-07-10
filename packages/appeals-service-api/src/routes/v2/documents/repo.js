const { createPrismaClient } = require('#db-client');
const { APPEAL_REDACTED_STATUS } = require('pins-data-model');

/**
 * @typedef {import('pins-data-model/src/schemas').AppealDocument} DataModelDocument
 * @typedef {import('@prisma/client').Document} PrismaDocument
 */

/**
 * @param {DataModelDocument} dataModelDocument
 * @returns {PrismaDocument}
 */
const mapDataModelToFODBDocument = ({
	caseId: _caseId,
	caseType: _caseType,
	documentId,
	caseStage,
	redactedStatus,
	...commonFields
}) => ({
	...commonFields,
	id: documentId,
	dateCreated: new Date(commonFields.dateCreated),
	dateReceived: commonFields.dateReceived ? new Date(commonFields.dateReceived) : null,
	lastModified: commonFields.lastModified ? new Date(commonFields.lastModified) : null,
	datePublished: commonFields.datePublished ? new Date(commonFields.datePublished) : null,
	stage: caseStage,
	published: !!commonFields.datePublished,
	redacted:
		redactedStatus === APPEAL_REDACTED_STATUS.REDACTED ||
		redactedStatus === APPEAL_REDACTED_STATUS.NO_REDACTION_REQUIRED
});

module.exports = class Repo {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * @param {DataModelDocument} data
	 * @returns {Promise<PrismaDocument>}
	 */
	async put(data) {
		return this.dbClient.$transaction(async (tx) => {
			const mappedData = mapDataModelToFODBDocument(data);
			return await tx.document.upsert({
				where: {
					id: mappedData.id
				},
				create: mappedData,
				update: mappedData
			});
		});
	}

	/**
	 * @param {string} id
	 * @returns {Promise<void>}
	 */
	async delete(id) {
		await this.dbClient.document.delete({
			where: {
				id
			}
		});
	}
};
