const { getJourney } = require('../journey-factory');

module.exports = () => (req, res, next) => {
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);

	for (const section of journey.sections) {
		for (const question of section.questions) {
			const answer = journey.response?.answers[question.fieldName];
			if (question.fieldName === 'uploadLpaStatementDocuments') {
				const additionalDocumentsAnswer = journey.response.answers['additionalDocuments'];
				if (additionalDocumentsAnswer !== 'yes') {
					continue;
				}
			}

			if (!answer || answer === '' || answer === undefined) {
				return res.redirect(journey.getCurrentQuestionUrl(section.segment, question.fieldName));
			}
		}
	}
	next();
};
