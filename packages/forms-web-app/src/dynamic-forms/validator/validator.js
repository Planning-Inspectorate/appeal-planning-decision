// todo(journey-refactor): move to middleware

const { validationResult } = require('express-validator');
const { getJourney } = require('../journey-factory');
const { getAddMoreIfPresent } = require('../middleware/utils');

/** @type {() => import('express').Handler} */
const validate = () => {
	return async (req, res, next) => {
		const { section, question } = req.params;

		const journeyResponse = res.locals.journeyResponse;
		const journey = getJourney(journeyResponse);

		let questionObj = journey.getQuestionBySectionAndName(section, question);

		questionObj = getAddMoreIfPresent(req, questionObj);
		if (!questionObj) {
			throw new Error('unknown question type');
		}

		for (const validation of questionObj.validators) {
			const validationRules = validation.validate(questionObj, journeyResponse);

			if (validationRules instanceof Array) {
				await Promise.all(validationRules.map((validator) => validator.run(req)));

				const errors = validationResult(req);
				const mappedErrors = errors.mapped();

				if (Object.keys(mappedErrors).length > 0) {
					break;
				}
			} else {
				const validatedRequest = await validationRules.run(req);

				if (validatedRequest.errors.length > 0) {
					break;
				}
			}
		}

		return next();
	};
};

module.exports = validate;
