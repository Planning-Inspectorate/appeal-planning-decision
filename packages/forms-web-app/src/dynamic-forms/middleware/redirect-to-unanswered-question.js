const { getJourney } = require('../journey-factory');

module.exports = () => (req, res, next) => {
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);

	const questionFieldNames = new Set(
		journey.sections.flatMap((section) => section.questions.map((question) => question.fieldName))
	);

	for (const fieldName of questionFieldNames) {
		const answer = journey.response.answers[fieldName];

		if (answer === undefined || answer === null || answer === '') {
			const section = journey.sections.find((s) =>
				s.questions.some((q) => q.fieldName === fieldName)
			);
			const question = section?.questions.find((q) => q.fieldName === fieldName);

			const questionUrl = journey.getCurrentQuestionUrl(section?.segment, question?.fieldName);
			return res.redirect(questionUrl);
		}
	}
	next();
};
