const { createPrismaClient } = require('#db-client');

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
	redacted: redactedStatus === 'redacted'
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
};
