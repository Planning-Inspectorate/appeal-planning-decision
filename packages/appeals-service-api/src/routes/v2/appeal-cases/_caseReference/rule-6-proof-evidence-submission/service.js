const { Rule6ProofOfEvidenceSubmissionRepository } = require('./repo');

const repo = new Rule6ProofOfEvidenceSubmissionRepository();

/**
 * @typedef {import('@prisma/client').Rule6ProofOfEvidenceSubmission} Rule6ProofOfEvidenceSubmission
 */

/**
 * Get Rule 6 Party Proof of Evidence Submission for an appealCase
 *
 * @param {string} appealCaseId
 * @return {Promise<Rule6ProofOfEvidenceSubmission|null>}
 */
async function getRule6ProofOfEvidenceByAppealId(appealCaseId) {
	const proofs = await repo.getRule6ProofOfEvidenceByAppealRef(appealCaseId);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * Create Rule 6 Party Proof of Evidence Submission for an appealCase
 *
 * @param {string} appealCaseId
 * @param {import('./repo').ProofOfEvidenceData} proofEvidenceData
 * @returns {Promise<Omit<Rule6ProofOfEvidenceSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function createRule6ProofOfEvidence(appealCaseId, proofEvidenceData) {
	const proofs = await repo.createRule6ProofOfEvidence(appealCaseId, proofEvidenceData);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * Put Rule 6 Party Proof of Evidence Submission for an appealCase
 *
 * @param {string} appealCaseId
 * @param {import('./repo').ProofOfEvidenceData} proofEvidenceData
 * @returns {Promise<Omit<Rule6ProofOfEvidenceSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function patchRule6ProofOfEvidenceByAppealId(appealCaseId, proofEvidenceData) {
	const proofs = await repo.patchRule6ProofOfEvidenceByAppealId(appealCaseId, proofEvidenceData);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * mark Rule 6 Party Proof of Evidence Submission as submitted to back office
 *
 * @param {string} caseReference
 * @return {Promise<{id: string}>}
 */
function markRule6ProofOfEvidenceAsSubmitted(caseReference) {
	return repo.markRule6ProofOfEvidenceAsSubmitted(caseReference);
}

module.exports = {
	getRule6ProofOfEvidenceByAppealId,
	createRule6ProofOfEvidence,
	patchRule6ProofOfEvidenceByAppealId,
	markRule6ProofOfEvidenceAsSubmitted
};
