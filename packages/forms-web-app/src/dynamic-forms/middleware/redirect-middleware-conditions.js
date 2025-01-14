/**
 * @param {import('../section').Question} question
 * @param {import('../journey-response').JourneyResponse} journeyResponse
 * @returns {boolean}
 */
const skipIfNoAdditionalDocuments = (question, journeyResponse) => {
	if (question.fieldName === 'uploadLpaStatementDocuments') {
		const additionalDocumentsAnswer = journeyResponse.answers['additionalDocuments'];
		return additionalDocumentsAnswer !== 'yes';
	}
	return false;
};

/**
 * @param {import('../section').Question} question
 * @param {import('../journey-response').JourneyResponse} journeyResponse
 * @returns {boolean}
 */
const appellantFinalCommentSkipConditions = (question, journeyResponse) => {
	if (
		question.fieldName === 'appellantFinalCommentDetails' ||
		question.fieldName === 'appellantFinalCommentDocuments'
	) {
		return journeyResponse.answers['appellantFinalComment'] !== 'yes';
	} else if (question.fieldName === 'uploadAppellantFinalCommentDocuments') {
		return journeyResponse.answers['appellantFinalCommentDocuments'] !== 'yes';
	}
	return false;
};

/**
 * @param {import('../section').Question} question
 * @param {import('../journey-response').JourneyResponse} journeyResponse
 * @returns {boolean}
 */
const lpaFinalCommentSkipConditions = (question, journeyResponse) => {
	if (
		question.fieldName === 'lpaFinalCommentDetails' ||
		question.fieldName === 'lpaFinalCommentDocuments'
	) {
		return journeyResponse.answers['lpaFinalComment'] !== 'yes';
	} else if (question.fieldName === 'uploadLPAFinalCommentDocuments') {
		return journeyResponse.answers['lpaFinalCommentDocuments'] !== 'yes';
	}
	return false;
};

/**
 * @param {import('../section').Question} question
 * @param {import('../journey-response').JourneyResponse} journeyResponse
 * @returns {boolean}
 */
const appellantProofEvidenceSkipConditions = (question, journeyResponse) => {
	if (question.fieldName === 'uploadAppellantWitnessesEvidence') {
		return journeyResponse.answers['appellantWitnesses'] !== 'yes';
	}
	return false;
};

/**
 * @param {import('../section').Question} question
 * @param {import('../journey-response').JourneyResponse} journeyResponse
 * @returns {boolean}
 */
const rule6ProofEvidenceSkipConditions = (question, journeyResponse) => {
	if (question.fieldName === 'uploadRule6WitnessesEvidence') {
		return journeyResponse.answers['rule6Witnesses'] !== 'yes';
	}
	return false;
};

/**
 * @param {import('../section').Question} question
 * @param {import('../journey-response').JourneyResponse} journeyResponse
 * @returns {boolean}
 */
const rule6StatementSkipConditions = (question, journeyResponse) => {
	if (question.fieldName === 'uploadRule6StatementDocuments') {
		return journeyResponse.answers['rule6AdditionalDocuments'] !== 'yes';
	}
	return false;
};

/**
 * @param {import('../section').Question} question
 * @param {import('../journey-response').JourneyResponse} journeyResponse
 * @returns {boolean}
 */
const lpaProofEvidenceSkipConditions = (question, journeyResponse) => {
	if (question.fieldName === 'uploadLpaWitnessesEvidence') {
		return journeyResponse.answers['lpaWitnesses'] !== 'yes';
	}
	return false;
};

module.exports = {
	skipIfNoAdditionalDocuments,
	appellantFinalCommentSkipConditions,
	lpaFinalCommentSkipConditions,
	appellantProofEvidenceSkipConditions,
	rule6ProofEvidenceSkipConditions,
	rule6StatementSkipConditions,
	lpaProofEvidenceSkipConditions
};
