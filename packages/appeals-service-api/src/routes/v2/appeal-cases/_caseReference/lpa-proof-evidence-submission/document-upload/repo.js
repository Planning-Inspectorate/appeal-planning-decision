const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@prisma/client').LPAProofOfEvidenceSubmission} LPAProofOfEvidenceSubmission
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
	 * Create submission document for given lpa Proof Of Evidence Submission
	 *
	 * @param {string} caseReference
	 * @param {DocumentUploadData} uploadData
	 * @returns {Promise<LPAProofOfEvidenceSubmission>}
	 */
	async createSubmissionDocument(caseReference, uploadData) {
		const { name, fileName, originalFileName, location, type, id: storageId } = uploadData;

		return await this.dbClient.lPAProofOfEvidenceSubmission.update({
			where: {
				caseReference: caseReference
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
				AppealCase: {
					select: {
						LPACode: true
					}
				},
				SubmissionDocumentUpload: true
			}
		});
	}

	/**
	 * Delete submission document
	 *
	 * @param {string} caseReference
	 * @param {string} documentId
	 * @returns {Promise<LPAProofOfEvidenceSubmission>}
	 */
	async deleteSubmissionDocument(caseReference, documentId) {
		return await this.dbClient.lPAProofOfEvidenceSubmission.update({
			where: {
				caseReference: caseReference
			},
			data: {
				SubmissionDocumentUpload: {
					delete: {
						id: documentId
					}
				}
			},
			include: {
				AppealCase: {
					select: {
						LPACode: true
					}
				},
				SubmissionDocumentUpload: true
			}
		});
	}
}

module.exports = { SubmissionDocumentUploadRepository };
