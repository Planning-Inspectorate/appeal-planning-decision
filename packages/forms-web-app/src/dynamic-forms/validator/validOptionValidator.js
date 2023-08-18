const { body } = require('express-validator');
const BaseValidator = require('./baseValidator.js');

class ValidOptionValidator extends BaseValidator {
	validate(questionObj, errorMessage) {
		return body(questionObj.fieldName)
			.custom((value) => {
				return questionObj.options.some((option) => option.value === value);
			})
			.withMessage(errorMessage);
	}
}

module.exports = ValidOptionValidator;
