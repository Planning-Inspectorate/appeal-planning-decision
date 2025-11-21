const { createPrismaClient } = require('#db-client');
const { Prisma } = require('@pins/database/src/client');

/**
 * @typedef {import('./rule-6-proof-evidence-submission').Rule6ProofOfEvidenceSubmission} Rule6ProofOfEvidenceSubmission
 */

/**
 * @typedef {Object} ProofOfEvidenceData
 * @property {boolean} [uploadRule6ProofOfEvidenceDocuments]
 * @property {boolean} [rule6Witnesses]
 * @property {boolean} [uploadRule6WitnessesEvidence]
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
							siteAddressLine1: true,
							siteAddressLine2: true,
							siteAddressTown: true,
							siteAddressCounty: true,
							siteAddressPostcode: true,
							applicationReference: true,
							proofsOfEvidenceDueDate: true
						}
					},
					SubmissionDocumentUpload: true
				}
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
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
	 * @param {string} _submissionDate // todo: mark this on rule 6 submission entity?
	 * @returns {Promise<{id: string}>}
	 */
	markRule6ProofOfEvidenceAsSubmitted(userId, caseReference, _submissionDate) {
		return this.dbClient.rule6ProofOfEvidenceSubmission.update({
			where: {
				caseReference,
				userId
			},
			data: {
				submitted: true
			},
			select: {
				id: true
			}
		});
	}
}

module.exports = { Rule6ProofOfEvidenceSubmissionRepository };
