const { createPrismaClient } = require('#db-client');
// const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').SubmissionDocumentUpload} SubmissionDocumentUpload
 */

class SubmissionDocumentUploadRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get all submission documents for given questionnaire
	 *
	 * @param {string} questionnaireId
	 * @returns {Promise<SubmissionDocumentUpload[]|null>}
	 */

	async getDocumentUploads(questionnaireId) {
		return await this.dbClient.submissionDocumentUpload.findMany({
			where: {
				questionnaireId
			}
		});
	}

	/**
	 * Create submission document for given questionnaire
	 *
	 * @param {object} uploadData
	 * @returns {Promise<SubmissionDocumentUpload|null>}
	 */
	async createSubmissionDocument(uploadData) {
		const { questionnaireId, name, fileName, originalFileName, location, type } = uploadData;

		return await this.dbClient.submissionDocumentUpload.create({
			data: {
				questionnaireId,
				name,
				fileName,
				originalFileName,
				location,
				type
			}
		});
	}

	// /**
	//  *
	//  * @param {*} caseReference
	//  * @param {*} data
	//  * @returns
	//  */
	// async patchSubmissionDocument(caseReference, data) {
	// 	return await this.dbClient.submissionDocumentUpload.update({
	// 		where: {
	// 			appealCaseReference: caseReference
	// 		},
	// 		data
	// 	});
	// }
}

module.exports = { SubmissionDocumentUploadRepository };
