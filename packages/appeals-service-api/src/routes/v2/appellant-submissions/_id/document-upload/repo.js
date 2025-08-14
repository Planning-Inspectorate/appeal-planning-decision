const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@prisma/client').AppellantSubmission} AppellantSubmission
 */

/**
 * @typedef {Object} DocumentUploadData
 * @property {string} id
 * @property {string} name
 * @property {string} fileName
 * @property {string} originalFileName
 * @property {string} location
 * @property {string} type
 */

class SubmissionDocumentUploadRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Create submission document for given questionnaire
	 *
	 * @param {string} id
	 * @param {DocumentUploadData[]} uploadData
	 * @returns {Promise<AppellantSubmission>}
	 */
	async createSubmissionDocument(id, uploadData) {
		const mappedUploadData = uploadData.map((file) => ({
			name: file.name,
			fileName: file.fileName,
			originalFileName: file.originalFileName,
			location: file.location,
			type: file.type,
			storageId: file.id
		}));

		return await this.dbClient.appellantSubmission.update({
			where: {
				id
			},
			data: {
				SubmissionDocumentUpload: {
					createMany: {
						data: mappedUploadData
					}
				}
			},
			include: {
				SubmissionDocumentUpload: true,
				SubmissionAddress: true,
				SubmissionLinkedCase: true
			}
		});
	}

	/**
	 * Delete submission document
	 *
	 * @param {string} id
	 * @param {string[]} documentIds
	 * @returns {Promise<AppellantSubmission>}
	 */
	async deleteSubmissionDocument(id, documentIds) {
		return await this.dbClient.appellantSubmission.update({
			where: {
				id
			},
			data: {
				SubmissionDocumentUpload: {
					deleteMany: {
						id: { in: documentIds }
					}
				}
			},
			include: {
				SubmissionDocumentUpload: true,
				SubmissionAddress: true,
				SubmissionLinkedCase: true
			}
		});
	}
}

module.exports = { SubmissionDocumentUploadRepository };
