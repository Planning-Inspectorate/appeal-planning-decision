const { getJourney } = require('../journey-factory');
const config = require('../../config');

module.exports = () => (req, res) => {
	const journeyResponse = res.locals.journeyResponse;
	const journey = getJourney(journeyResponse);

	for (const section of journey.sections) {
		for (const question of section.questions) {
			const answer = journey.response?.answers[question.fieldName];
			if (!answer || answer === '' || answer === undefined) {
				let redirectUrl;

				if (section.segment === config.dynamicForms.DEFAULT_SECTION) {
					redirectUrl = `${journey.baseUrl}/${encodeURIComponent(question.url)}`;
				} else {
					redirectUrl = `${journey.baseUrl}/${encodeURIComponent(
						section.segment
					)}/${encodeURIComponent(question.fieldName)}`;
				}
				return res.redirect(redirectUrl);
			}
		}
	}
};
