const { AppellantProofOfEvidenceSubmissionRepository } = require('./repo');

const repo = new AppellantProofOfEvidenceSubmissionRepository();

/**
 * @typedef {import('./appellant-proof-evidence-submission').AppellantProofOfEvidenceSubmission} AppellantProofOfEvidenceSubmission
 */

/**
 * Get Appellant Final Comment for an appealCase
 *
 * @param {string} appealCaseId
 * @return {Promise<AppellantProofOfEvidenceSubmission|null>}
 */
async function getAppellantProofOfEvidenceByAppealId(appealCaseId) {
	const proofs = await repo.getAppellantProofOfEvidenceByAppealRef(appealCaseId);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * Create AppellantFinalComment for an appealCase
 *
 * @param {string} appealCaseId
 * @param {import('./repo').ProofOfEvidenceData} finalCommentData
 * @returns {Promise<Omit<AppellantProofOfEvidenceSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function createAppellantProofOfEvidence(appealCaseId, finalCommentData) {
	const proofs = await repo.createAppellantProofOfEvidence(appealCaseId, finalCommentData);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * Put AppellantProofOfEvidence for an appealCase
 *
 * @param {string} appealCaseId
 * @param {import('./repo').ProofOfEvidenceData} finalCommentData
 * @returns {Promise<Omit<AppellantProofOfEvidenceSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function patchAppellantProofOfEvidenceByAppealId(appealCaseId, finalCommentData) {
	const proofs = await repo.patchAppellantProofOfEvidenceByAppealId(appealCaseId, finalCommentData);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * mark Proof Of Evidence as submitted to back office
 *
 * @param {string} caseReference
 * @param {string} appellantCommentsSubmitted
 * @return {Promise<{id: string}>}
 */
function markAppellantProofOfEvidenceAsSubmitted(caseReference, appellantCommentsSubmitted) {
	return repo.markAppellantProofOfEvidenceAsSubmitted(caseReference, appellantCommentsSubmitted);
}

module.exports = {
	getAppellantProofOfEvidenceByAppealId,
	createAppellantProofOfEvidence,
	patchAppellantProofOfEvidenceByAppealId,
	markAppellantProofOfEvidenceAsSubmitted
};
