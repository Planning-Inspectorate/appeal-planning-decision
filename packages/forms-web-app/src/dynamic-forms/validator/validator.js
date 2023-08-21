const RequiredValidator = require('./requiredValidator');
const ValidOptionValidator = require('./validOptionValidator');
const hasJourney = require('../has-questionnaire/journey');

const validate = () => {
	return async (req, res, next) => {
		const { section, question } = req.params;
		var questionObj = hasJourney.getQuestionBySectionAndName(section, question);
		const validations = [];
		questionObj.validators.forEach((validator) => {
			switch (validator.constructor) {
				case RequiredValidator:
					validations.push(new RequiredValidator().validate(questionObj));
					break;
				case ValidOptionValidator:
					validations.push(new ValidOptionValidator().validate(questionObj));
					break;
				default:
					throw new Error(`Validator of type ${validator.constructor} not implemented`);
			}
		});

		const results = [];
		let overallResult = true;
		for (const validation of validations) {
			let validationResult = await validation.run(req);
			results.push(validationResult);
			if (validationResult.errors.length > 0) {
				next();
				overallResult = false;
				break;
			}
		}
		return overallResult;
	};
};

module.exports = validate;
