const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@pins/database/src/client/client').Rule6ProofOfEvidenceSubmission} Rule6ProofOfEvidenceSubmission
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
	 * Create submission document for given Rule 6 Party Proof Of Evidence Submission
	 *
	 * @param {string} userId
	 * @param {string} caseReference
	 * @param {DocumentUploadData[]} uploadData
	 * @returns {Promise<Rule6ProofOfEvidenceSubmission>}
	 */
	async createSubmissionDocument(userId, caseReference, uploadData) {
		const mappedUploadData = uploadData.map((file) => ({
			name: file.name,
			fileName: file.fileName,
			originalFileName: file.originalFileName,
			location: file.location,
			type: file.type,
			storageId: file.id
		}));

		return await this.dbClient.rule6ProofOfEvidenceSubmission.update({
			where: {
				caseReference_userId: {
					userId,
					caseReference
				}
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
	 * @param {string} userId
	 * @param {string} caseReference
	 * @param {string[]} documentIds
	 * @returns {Promise<Rule6ProofOfEvidenceSubmission>}
	 */
	async deleteSubmissionDocument(userId, caseReference, documentIds) {
		return await this.dbClient.rule6ProofOfEvidenceSubmission.update({
			where: {
				caseReference_userId: {
					userId,
					caseReference
				}
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
