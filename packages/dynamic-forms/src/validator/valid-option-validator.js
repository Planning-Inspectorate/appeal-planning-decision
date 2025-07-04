const { body } = require('express-validator');
const BaseValidator = require('./base-validator.js');
const { optionIsDivider } = require('../dynamic-components/utils/question-utils.js');

/**
 * @typedef {import('../questions/options-question.js')} OptionsQuestion
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
	 * @returns {import('express-validator').ValidationChain}
	 */
	/**
	 * @param {import('../questions/options-question.js').OptionsQuestion} question
	 * @param {import('../journey-response').JourneyResponse} _journeyResponse
	 * @returns {import('express-validator').ValidationChain | import('express-validator').ValidationChain[]}
	 */
	validate(question, _journeyResponse) {
		return body(question.fieldName)
			.custom((value) => {
				if (!value) return true;
				value = Array.isArray(value) ? value : [value];
				return value.every((/** @type {string} */ element) => {
					const mappedOptions = question.options.map((option) => {
						return optionIsDivider(option) ? null : option.value;
					});
					return mappedOptions.includes(element);
				});
			})
			.withMessage(this.errorMessage);
	}
}

module.exports = ValidOptionValidator;
