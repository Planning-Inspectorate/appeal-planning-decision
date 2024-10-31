const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').LPAProofOfEvidenceSubmission} LPAProofOfEvidenceSubmission
 */

/**
 * @typedef {Object} ProofOfEvidenceData
 * @property {boolean} [lpaProofOfEvidenceDocuments]
 * @property {boolean} [lpaWitnesses]
 * @property {boolean} [lpaWitnessesEvidence]
 */

class LpaProofOfEvidenceSubmissionRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get lpa final comment for given appeal
	 *
	 * @param {string} caseReference
	 * @returns {Promise<LPAProofOfEvidenceSubmission|null>}
	 */
	async getLpaProofOfEvidenceByAppealRef(caseReference) {
		try {
			return await this.dbClient.lPAProofOfEvidenceSubmission.findUnique({
				where: {
					caseReference
				},
				include: {
					AppealCase: {
						select: {
							LPACode: true,
							appealTypeCode: true,
							proofsOfEvidenceDueDate: true,
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
	 * Create lpa final comment for given appeal
	 *
	 * @param {string} caseReference
	 * @param {ProofOfEvidenceData} data
	 * @returns {Promise<Omit<LPAProofOfEvidenceSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async createLpaProofOfEvidence(caseReference, data) {
		return await this.dbClient.lPAProofOfEvidenceSubmission.create({
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
	 * @returns {Promise<Omit<LPAProofOfEvidenceSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async patchLpaProofOfEvidenceByAppealId(caseReference, data) {
		return await this.dbClient.lPAProofOfEvidenceSubmission.update({
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
	 * @param {string} lpaProofsSubmitted date time string of date submitted to FO
	 * @returns {Promise<{id: string}>}
	 */
	markLpaProofOfEvidenceAsSubmitted(caseReference, lpaProofsSubmitted) {
		return this.dbClient.lPAProofOfEvidenceSubmission.update({
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
							LPAProofsSubmitted: lpaProofsSubmitted
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

module.exports = { LpaProofOfEvidenceSubmissionRepository };
