const { LpaProofOfEvidenceSubmissionRepository } = require('./repo');

const repo = new LpaProofOfEvidenceSubmissionRepository();

/**
 * @typedef {import('@prisma/client').LPAProofOfEvidenceSubmission} LPAProofOfEvidenceSubmission
 */

/**
 * Get lpa proof of evidence for an appealCase
 *
 * @param {string} appealCaseId
 * @return {Promise<LPAProofOfEvidenceSubmission|null>}
 */
async function getLpaProofOfEvidenceByAppealId(appealCaseId) {
	const proofs = await repo.getLpaProofOfEvidenceByAppealRef(appealCaseId);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * Create lpa proof of evidence for an appealCase
 *
 * @param {string} appealCaseId
 * @param {import('./repo').ProofOfEvidenceData} proofEvidenceData
 * @returns {Promise<Omit<LPAProofOfEvidenceSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function createLpaProofOfEvidence(appealCaseId, proofEvidenceData) {
	const proofs = await repo.createLpaProofOfEvidence(appealCaseId, proofEvidenceData);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * Put lpa proof of evidence for an appealCase
 *
 * @param {string} appealCaseId
 * @param {import('./repo').ProofOfEvidenceData} proofEvidenceData
 * @returns {Promise<Omit<LPAProofOfEvidenceSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function patchLpaProofOfEvidenceByAppealId(appealCaseId, proofEvidenceData) {
	const proofs = await repo.patchLpaProofOfEvidenceByAppealId(appealCaseId, proofEvidenceData);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * mark lpa proof of evidence as submitted to back office
 *
 * @param {string} caseReference
 * @param {string} lpaProofEvidenceSubmitted
 * @return {Promise<{id: string}>}
 */
function markLpaProofOfEvidenceAsSubmitted(caseReference, lpaProofEvidenceSubmitted) {
	return repo.markLpaProofOfEvidenceAsSubmitted(caseReference, lpaProofEvidenceSubmitted);
}

module.exports = {
	getLpaProofOfEvidenceByAppealId,
	createLpaProofOfEvidence,
	patchLpaProofOfEvidenceByAppealId,
	markLpaProofOfEvidenceAsSubmitted
};
