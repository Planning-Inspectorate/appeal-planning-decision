const { body } = require('express-validator');
const BaseValidator = require('./baseValidator.js');

class ValidOptionValidator extends BaseValidator {
	validate(questionObj, errorMessage) {
		return body(questionObj.fieldName)
			.custom((value) => {
				if (!questionObj.options.includes(value)) throw new Error();
			})
			.withMessage(errorMessage);
	}
}

module.exports = ValidOptionValidator;
