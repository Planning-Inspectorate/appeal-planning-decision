const { body } = require('express-validator');
const BaseValidator = require('./baseValidator.js');

class RequiredValidator extends BaseValidator {
	validate(questionObj, errorMessage) {
		return body(questionObj.fieldName).notEmpty().withMessage(errorMessage);
	}
}

module.exports = RequiredValidator;
