const { body } = require('express-validator');
const BaseValidator = require('./base-validator.js');

/**
 * @typedef {import('../options-question.js')} OptionsQuestion
 */

/**
 * enforces a field is within the question's predefined list of options
 * @class
 */
class ValidOptionValidator extends BaseValidator {
	/**
	 * creates an instance of a RequiredValidator
	 * @param {string} [errorMessage] - custom error message to show on validation failure
	 */
	constructor(errorMessage) {
		super();

		if (errorMessage) {
			this.errorMessage = errorMessage;
		} else {
			this.errorMessage = 'You must select a valid answer';
		}
	}

	/**
	 * validates the response body, checking the value sent for the questionObj's fieldname is within the predefined list of options
	 * @param {OptionsQuestion} questionObj
	 */
	validate(questionObj) {
		return body(questionObj.fieldName)
			.custom((value) => {
				return !value || questionObj.options.some((option) => option.value === value);
			})
			.withMessage(this.errorMessage);
	}
}

module.exports = ValidOptionValidator;
