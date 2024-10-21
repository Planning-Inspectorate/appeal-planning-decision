const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').AppellantProofOfEvidenceSubmission} AppellantProofOfEvidenceSubmission
 */

/**
 * @typedef {Object} ProofOfEvidenceData
 * @property {boolean} [appellantProofOfEvidenceDocuments]
 * @property {boolean} [appellantWitnesses]
 * @property {boolean} [appellantWitnessesEvidence]
 */

class AppellantProofOfEvidenceSubmissionRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get appellant final comment for given appeal
	 *
	 * @param {string} caseReference
	 * @returns {Promise<AppellantProofOfEvidenceSubmission|null>}
	 */
	async getAppellantProofOfEvidenceByAppealRef(caseReference) {
		try {
			return await this.dbClient.appellantProofOfEvidenceSubmission.findUnique({
				where: {
					caseReference
				},
				include: {
					AppealCase: {
						select: {
							LPACode: true,
							appealTypeCode: true,
							finalCommentsDueDate: true,
							siteAddressLine1: true,
							siteAddressLine2: true,
							siteAddressTown: true,
							siteAddressCounty: true,
							siteAddressPostcode: true
						}
					},
					SubmissionDocumentUpload: true
				}
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}

	/**
	 * Create appellant final comment for given appeal
	 *
	 * @param {string} caseReference
	 * @param {ProofOfEvidenceData} data
	 * @returns {Promise<Omit<AppellantProofOfEvidenceSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async createAppellantProofOfEvidence(caseReference, data) {
		return await this.dbClient.appellantProofOfEvidenceSubmission.create({
			data: {
				caseReference,
				...data
			},
			include: {
				AppealCase: {
					select: {
						LPACode: true,
						appealTypeCode: true
					}
				}
			}
		});
	}

	/**
	 *
	 * @param {string} caseReference
	 * @param {ProofOfEvidenceData} data
	 * @returns {Promise<Omit<AppellantProofOfEvidenceSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async patchAppellantProofOfEvidenceByAppealId(caseReference, data) {
		return await this.dbClient.appellantProofOfEvidenceSubmission.update({
			where: {
				caseReference
			},
			data,
			include: {
				AppealCase: {
					select: {
						LPACode: true,
						appealTypeCode: true
					}
				}
			}
		});
	}

	/**
	 * @param {string} caseReference
	 * @param {string} appellantsProofsSubmitted date time string of date submitted to FO
	 * @returns {Promise<{id: string}>}
	 */
	markAppellantProofOfEvidenceAsSubmitted(caseReference, appellantsProofsSubmitted) {
		return this.dbClient.appellantProofOfEvidenceSubmission.update({
			where: {
				caseReference
			},
			data: {
				submitted: true,
				AppealCase: {
					update: {
						where: {
							caseReference
						},
						data: {
							appellantsProofsSubmitted
						}
					}
				}
			},
			select: {
				id: true
			}
		});
	}
}

module.exports = { AppellantProofOfEvidenceSubmissionRepository };
