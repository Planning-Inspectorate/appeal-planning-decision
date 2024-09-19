/**
 * @param {[((question: import('../section').Question, journeyResponse: import('../journey-response').JourneyResponse) => boolean)]} conditions
 * @returns {import('express').Handler}
 */
module.exports = (conditions) => (req, res, next) => {
	const { journeyResponse, journey } = res.locals;

	for (const section of journey.sections) {
		for (const question of section.questions) {
			const answer = journey.response?.answers[question.fieldName];

			const shouldSkip = conditions.some((condition) => condition(question, journeyResponse));
			if (shouldSkip) {
				continue;
			}

			if (!answer || answer === '' || answer === undefined) {
				return res.redirect(journey.getCurrentQuestionUrl(section.segment, question.fieldName));
			}
		}
	}
	next();
};
