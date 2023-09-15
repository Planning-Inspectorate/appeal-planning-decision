const { getJourney } = require('../journey-factory');
const { getSubquestionIfPresent } = require('../middleware/utils');

/**
 * @typedef {import('../journey-factory').JourneyType} JourneyType
 */

const validate = () => {
	return async (req, res, next) => {
		const { section, question } = req.params;

		const journeyResponse = res.locals.journeyResponse;
		const journey = getJourney(journeyResponse);

		let questionObj = journey.getQuestionBySectionAndName(section, question);

		questionObj = getSubquestionIfPresent(req, questionObj);

		if (!questionObj) {
			throw new Error('unknown question type');
		}

		for (const validation of questionObj.validators) {
			const validator = validation.validate(questionObj, journeyResponse);

			const validationResult = await validator.run(req);

			if (validationResult.errors.length > 0) {
				break;
			}
		}

		return next();
	};
};

module.exports = validate;
