const { Rule6ProofOfEvidenceSubmissionRepository } = require('./repo');

const repo = new Rule6ProofOfEvidenceSubmissionRepository();

/**
 * @typedef {import('@prisma/client').Rule6ProofOfEvidenceSubmission} Rule6ProofOfEvidenceSubmission
 */

/**
 * Get Rule 6 Party Proof of Evidence Submission for an appealCase
 *
 * @param {string | undefined} userId
 * @param {string} appealCaseId
 * @return {Promise<Rule6ProofOfEvidenceSubmission|null>}
 */
async function getRule6ProofOfEvidenceByAppealId(userId, appealCaseId) {
	if (!userId) {
		return null;
	}

	const proofs = await repo.getRule6ProofOfEvidenceByAppealRef(userId, appealCaseId);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * Create Rule 6 Party Proof of Evidence Submission for an appealCase
 *
 * @param {string | undefined} userId
 * @param {string} appealCaseId
 * @param {import('./repo').ProofOfEvidenceData} proofEvidenceData
 * @returns {Promise<Omit<Rule6ProofOfEvidenceSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function createRule6ProofOfEvidence(userId, appealCaseId, proofEvidenceData) {
	if (!userId) {
		return null;
	}
	const proofs = await repo.createRule6ProofOfEvidence(userId, appealCaseId, proofEvidenceData);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * Put Rule 6 Party Proof of Evidence Submission for an appealCase
 *
 * @param {string | undefined} userId
 * @param {string} appealCaseId
 * @param {import('./repo').ProofOfEvidenceData} proofEvidenceData
 * @returns {Promise<Omit<Rule6ProofOfEvidenceSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function patchRule6ProofOfEvidenceByAppealId(userId, appealCaseId, proofEvidenceData) {
	if (!userId) {
		return null;
	}

	const proofs = await repo.patchRule6ProofOfEvidenceByAppealId(
		userId,
		appealCaseId,
		proofEvidenceData
	);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * mark Rule 6 Party Proof of Evidence Submission as submitted to back office
 *
 * @param {string} userId
 * @param {string} caseReference
 * @param {string} submissionDate
 * @return {Promise<{id: string}>}
 */
function markRule6ProofOfEvidenceAsSubmitted(userId, caseReference, submissionDate) {
	return repo.markRule6ProofOfEvidenceAsSubmitted(userId, caseReference, submissionDate);
}

module.exports = {
	getRule6ProofOfEvidenceByAppealId,
	createRule6ProofOfEvidence,
	patchRule6ProofOfEvidenceByAppealId,
	markRule6ProofOfEvidenceAsSubmitted
};
