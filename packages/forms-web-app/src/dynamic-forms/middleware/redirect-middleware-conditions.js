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

module.exports = {
	skipIfNoAdditionalDocuments,
	appellantFinalCommentSkipConditions,
	lpaFinalCommentSkipConditions,
	appellantProofEvidenceSkipConditions
};
