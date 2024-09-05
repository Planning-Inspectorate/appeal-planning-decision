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

module.exports = { skipIfNoAdditionalDocuments };
