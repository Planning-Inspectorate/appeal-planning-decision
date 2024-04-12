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
	 * @param {DocumentUploadData} uploadData
	 * @returns {Promise<AppellantSubmission>}
	 */
	async createSubmissionDocument(id, uploadData) {
		const { name, fileName, originalFileName, location, type, id: storageId } = uploadData;

		return await this.dbClient.appellantSubmission.update({
			where: {
				id
			},
			data: {
				SubmissionDocumentUpload: {
					create: {
						name,
						fileName,
						originalFileName,
						location,
						type,
						storageId
					}
				}
			},
			include: {
				SubmissionDocumentUpload: true,
				SubmissionAddress: true
			}
		});
	}

	/**
	 * Delete submission document
	 *
	 * @param {string} id
	 * @param {string} documentId
	 * @returns {Promise<AppellantSubmission>}
	 */
	async deleteSubmissionDocument(id, documentId) {
		console.log(
			'🚀 ~ SubmissionDocumentUploadRepository ~ deleteSubmissionDocument ~ id, documentId:',
			id,
			documentId
		);
		return await this.dbClient.appellantSubmission.update({
			where: {
				id
			},
			data: {
				SubmissionDocumentUpload: {
					delete: {
						id: documentId
					}
				}
			},
			include: {
				SubmissionDocumentUpload: true,
				SubmissionAddress: true
			}
		});
	}
}

module.exports = { SubmissionDocumentUploadRepository };
