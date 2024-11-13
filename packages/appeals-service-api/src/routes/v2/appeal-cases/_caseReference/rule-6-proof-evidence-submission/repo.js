const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').Rule6ProofOfEvidenceSubmission} Rule6ProofOfEvidenceSubmission
 */

/**
 * @typedef {Object} ProofOfEvidenceData
 * @property {boolean} [rule6ProofOfEvidenceDocuments]
 * @property {boolean} [rule6Witnesses]
 * @property {boolean} [rule6WitnessesEvidence]
 */

class Rule6ProofOfEvidenceSubmissionRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get rule6 party proof of evidence for given appeal
	 *
	 * @param {string} userId
	 * @param {string} caseReference
	 * @returns {Promise<Rule6ProofOfEvidenceSubmission|null>}
	 */
	async getRule6ProofOfEvidenceByAppealRef(userId, caseReference) {
		try {
			return await this.dbClient.rule6ProofOfEvidenceSubmission.findUnique({
				where: {
					caseReference,
					userId
				},
				include: {
					AppealCase: {
						select: {
							LPACode: true,
							appealTypeCode: true,
							rule6ProofEvidenceDueDate: true,
							siteAddressLine1: true,
							siteAddressLine2: true,
							siteAddressTown: true,
							siteAddressCounty: true,
							siteAddressPostcode: true,
							applicationReference: true
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
	 * Create rule 6 proof of evidence for given appeal
	 *
	 * @param {string} userId
	 * @param {string} caseReference
	 * @param {ProofOfEvidenceData} data
	 * @returns {Promise<Omit<Rule6ProofOfEvidenceSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async createRule6ProofOfEvidence(userId, caseReference, data) {
		return await this.dbClient.rule6ProofOfEvidenceSubmission.create({
			data: {
				userId,
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
	 * @param {string} userId
	 * @param {string} caseReference
	 * @param {ProofOfEvidenceData} data
	 * @returns {Promise<Omit<Rule6ProofOfEvidenceSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async patchRule6ProofOfEvidenceByAppealId(userId, caseReference, data) {
		return await this.dbClient.rule6ProofOfEvidenceSubmission.update({
			where: {
				caseReference,
				userId
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
	 * @param {string} userId
	 * @param {string} caseReference
	 * @param {string} submissionDate
	 * @returns {Promise<{id: string}>}
	 */
	markRule6ProofOfEvidenceAsSubmitted(userId, caseReference, submissionDate) {
		return this.dbClient.rule6ProofOfEvidenceSubmission.update({
			where: {
				caseReference,
				userId
			},
			data: {
				submitted: true,
				AppealCase: {
					update: {
						where: {
							caseReference
						},
						data: {
							rule6ProofEvidenceSubmitted: true,
							rule6ProofEvidenceSubmittedDate: submissionDate
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

module.exports = { Rule6ProofOfEvidenceSubmissionRepository };
