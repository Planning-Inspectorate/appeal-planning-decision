/**
 * @param {[((question: import('../section').Question, journeyResponse: import('../journey-response').JourneyResponse) => boolean)]} conditions
 * @returns {import('express').Handler}
 */
module.exports = (conditions) => (req, res, next) => {
	const { journeyResponse, journey } = res.locals;

	const isTaskList = req.originalUrl.endsWith(journey.baseUrl);
	const previousPage = req.session.navigationHistory[1];

	const firstSection = journey.sections[0];
	const firstquestion = firstSection.questions[0];
	const firstQuestionUrl = journey.getCurrentQuestionUrl(
		firstSection.segment,
		firstquestion.fieldName
	);

	if (isTaskList && previousPage.includes('/your-appeals')) {
		return res.redirect(firstQuestionUrl);
	}

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
