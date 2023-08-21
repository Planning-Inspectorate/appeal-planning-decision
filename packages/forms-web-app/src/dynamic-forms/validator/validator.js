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

		const result = await Promise.all(validations.map((validation) => validation.run(req)));
		const errors = result.reduce((a, b) => a.concat(b.errors), []);
		if (errors.length === 0) {
			next();
			return true;
		} else {
			return result;
		}
	};
};

module.exports = validate;
