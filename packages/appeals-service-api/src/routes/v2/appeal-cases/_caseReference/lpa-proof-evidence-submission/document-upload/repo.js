const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@pins/database/src/client/client').LPAProofOfEvidenceSubmission} LPAProofOfEvidenceSubmission
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
	 * @param {DocumentUploadData[]} uploadData
	 * @returns {Promise<LPAProofOfEvidenceSubmission>}
	 */
	async createSubmissionDocument(caseReference, uploadData) {
		const mappedUploadData = uploadData.map((file) => ({
			name: file.name,
			fileName: file.fileName,
			originalFileName: file.originalFileName,
			location: file.location,
			type: file.type,
			storageId: file.id
		}));

		return await this.dbClient.lPAProofOfEvidenceSubmission.update({
			where: {
				caseReference: caseReference
			},
			data: {
				SubmissionDocumentUpload: {
					createMany: {
						data: mappedUploadData
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
	 * @param {string[]} documentIds
	 * @returns {Promise<LPAProofOfEvidenceSubmission>}
	 */
	async deleteSubmissionDocument(caseReference, documentIds) {
		return await this.dbClient.lPAProofOfEvidenceSubmission.update({
			where: {
				caseReference: caseReference
			},
			data: {
				SubmissionDocumentUpload: {
					deleteMany: {
						id: { in: documentIds }
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
