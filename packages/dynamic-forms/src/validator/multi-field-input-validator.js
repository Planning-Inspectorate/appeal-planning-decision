const { body } = require('express-validator');
const BaseValidator = require('./base-validator.js');

/**
 * @typedef {Object} Regex
 * @property {String | RegExp} regex
 * @property {String} regexMessage
 */

/**
 * @typedef {Object} MinLength
 * @property {Number} minLength
 * @property {String} minLengthMessage
 */

/**
 * @typedef {Object} MaxLength
 * @property {Number} maxLength
 * @property {String} maxLengthMessage
 */

/**
 * @typedef {Object} RequiredField
 * @property {string} fieldName
 * @property {string} errorMessage
 * @property {MinLength} [minLength]
 * @property {MaxLength} [maxLength]
 * @property {Regex} [regex]
 */

class MultiFieldInputValidator extends BaseValidator {
	/**
	 * @param {Object} params
	 * @param {RequiredField[]} [params.requiredFields]
	 * @param {string} [params.noInputsMessage]
	 */
	constructor({ requiredFields, noInputsMessage } = {}) {
		super();

		if (!requiredFields)
			throw new Error('MultiFieldInput validator is invoked without any required fields');
		this.requiredFields = requiredFields;
		this.noInputsMessage = noInputsMessage || 'Please complete the question';
	}

	/**
	 * validates the response body, checking the value sent for the questionObj's fieldname is within the predefined list of options
	 * @param {import('../questions/question')} _question
	 * @param {import('../journey-response').JourneyResponse} _journeyResponse
	 * @returns {import('express-validator').ValidationChain[]}
	 */
	validate(_question, _journeyResponse) {
		let rules = [];

		for (const requiredField of this.requiredFields) {
			const { minLength, maxLength, regex, fieldName, errorMessage } = requiredField;

			const fieldBody = body(fieldName);

			rules.push(fieldBody.notEmpty().withMessage(errorMessage));

			if (minLength) {
				rules.push(
					fieldBody.isLength({ min: minLength.minLength }).withMessage(minLength.minLengthMessage)
				);
			}

			if (maxLength) {
				rules.push(
					fieldBody.isLength({ max: maxLength.maxLength }).withMessage(maxLength.maxLengthMessage)
				);
			}

			if (regex) {
				rules.push(fieldBody.matches(new RegExp(regex.regex)).withMessage(regex.regexMessage));
			}
		}

		return rules;
	}
}

module.exports = MultiFieldInputValidator;
