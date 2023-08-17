const { body } = require('express-validator');
const BaseValidator = require('./baseValidator.js');

class BooleaValidator extends BaseValidator {
	validate(questionObj, errorMessage) {
		return body(questionObj.fieldName).notEmpty().withMessage(errorMessage);
	}
}

module.exports = BooleaValidator;
