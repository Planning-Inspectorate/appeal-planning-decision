const { createPrismaClient } = require('#db-client');
const { APPEAL_REDACTED_STATUS } = require('@planning-inspectorate/data-model');

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @typedef {import('@planning-inspectorate/data-model/src/schemas').AppealDocument} DataModelDocument
 * @typedef {import('@pins/database/src/client/client').Document} PrismaDocument
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
		redactedStatus === null
			? null
			: redactedStatus === APPEAL_REDACTED_STATUS.REDACTED ||
				redactedStatus === APPEAL_REDACTED_STATUS.NO_REDACTION_REQUIRED
});

module.exports = class Repo {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * @param {string} id
	 * @returns {Promise<PrismaDocument>}
	 */
	async get(id) {
		return await this.dbClient.document.findUniqueOrThrow({
			where: {
				id
			}
		});
	}

	/**
	 * @param {DataModelDocument} data
	 * @returns {Promise<PrismaDocument>}
	 */
	async put(data) {
		const mappedData = mapDataModelToFODBDocument(data);
		try {
			return await this.#putInner(mappedData);
		} catch (error) {
			// retry the upsert if we get a unique constraint error to handle race condition
			// this has happened in prod leading to deadletter
			if (error.code !== 'P2002') throw error;
			await delay(300);
			return await this.#putInner(mappedData);
		}
	}

	/**
	 * @param {PrismaDocument} data
	 * @returns {Promise<PrismaDocument>}
	 */
	async #putInner(data) {
		return this.dbClient.document.upsert({
			where: {
				id: data.id
			},
			create: data,
			update: data
		});
	}

	/**
	 * @param {string} id
	 * @returns {Promise<void>}
	 */
	async delete(id) {
		await this.dbClient.representationDocument.deleteMany({
			where: {
				documentId: id
			}
		});

		await this.dbClient.document.delete({
			where: {
				id
			}
		});
	}
};
