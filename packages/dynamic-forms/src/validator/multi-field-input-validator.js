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
 * @typedef {Object} LessThan
 * @property {Number} lessThan
 * @property {String} lessThanMessage
 * @property {boolean} [allowLeadingZeros]
 */

/**
 * @typedef {Object} RequiredField
 * @property {string} fieldName
 * @property {string} errorMessage
 * @property {MinLength} [minLength]
 * @property {MaxLength} [maxLength]
 * @property {Regex} [regex]
 * @property {LessThan} [lessThan]
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
	 * @param {import('../question')} _question
	 * @param {import('../journey-response').JourneyResponse} _journeyResponse
	 * @returns {import('express-validator').ValidationChain[]}
	 */
	validate(_question, _journeyResponse) {
		// const requiredFieldNames = this.requiredFields.map((requiredField) => requiredField.fieldName);

		const rules = [];
		// results.push(body(requiredFieldNames).notEmpty().withMessage(this.noInputsMessage));

		for (const requiredField of this.requiredFields) {
			const { minLength, maxLength, regex, lessThan, fieldName, errorMessage } = requiredField;

			const fieldBody = body(fieldName);

			fieldBody.notEmpty().withMessage(errorMessage).bail();

			if (regex) {
				fieldBody.matches(new RegExp(regex.regex)).withMessage(regex.regexMessage).bail();
			}

			if (lessThan) {
				fieldBody
					.isInt({ lt: lessThan.lessThan, allow_leading_zeroes: lessThan.allowLeadingZeros })
					.withMessage(lessThan.lessThanMessage)
					.bail();
			}

			if (minLength) {
				fieldBody
					.isLength({ min: minLength.minLength })
					.withMessage(minLength.minLengthMessage)
					.bail();
			}

			if (maxLength) {
				fieldBody
					.isLength({ max: maxLength.maxLength })
					.withMessage(maxLength.maxLengthMessage)
					.bail();
			}

			rules.push(fieldBody);
		}

		return rules;
	}
}

module.exports = MultiFieldInputValidator;
