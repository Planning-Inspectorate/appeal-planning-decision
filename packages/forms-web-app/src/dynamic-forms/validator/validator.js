const { getJourney } = require('../journey-factory');

/**
 * @typedef {import('../journey-factory').JourneyType} JourneyType
 */

const validate = () => {
	return async (req, res, next) => {
		const { section, question } = req.params;

		const journeyResponse = res.locals.journeyResponse;
		const journey = getJourney(journeyResponse);

		const questionObj = journey.getQuestionBySectionAndName(section, question);

		if (!questionObj) {
			throw new Error('unknown question type');
		}

		for (const validation of questionObj.validators) {
			let validationResult = await validation.validate(questionObj).run(req);
			if (validationResult.errors.length > 0) {
				break;
			}
		}

		return next();
	};
};

module.exports = validate;
