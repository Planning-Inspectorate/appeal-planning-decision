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
	 * @param {RequiredField[]} params.requiredFields
	 * @param {string} [params.noInputsMessage]
	 */
	constructor({ requiredFields, noInputsMessage }) {
		super();

		if (!requiredFields)
			throw new Error('MultiFieldInput validator is invoked without any required fields');
		this.requiredFields = requiredFields;
		this.noInputsMessage = noInputsMessage || 'Please complete the question';
	}

	/**
	 * validates response body using questionObj inputFields fieldNames
	 */

	validate() {
		// const requiredFieldNames = this.requiredFields.map((requiredField) => requiredField.fieldName);

		let results = [];

		// results.push(body(requiredFieldNames).notEmpty().withMessage(this.noInputsMessage));

		for (const requiredField of this.requiredFields) {
			results.push(
				body(requiredField.fieldName).notEmpty().withMessage(requiredField.errorMessage)
			);

			if (requiredField.minLength) {
				results.push(
					body(requiredField.fieldName)
						.isLength({ min: requiredField.minLength.minLength })
						.withMessage(requiredField.minLength.minLengthMessage)
				);
			}

			if (requiredField.maxLength) {
				results.push(
					body(requiredField.fieldName)
						.isLength({ max: requiredField.maxLength.maxLength })
						.withMessage(requiredField.maxLength.maxLengthMessage)
				);
			}

			if (requiredField.regex) {
				results.push(
					body(requiredField.fieldName)
						.matches(new RegExp(requiredField.regex.regex))
						.withMessage(requiredField.regex.regexMessage)
				);
			}
		}

		return results;
	}
}

module.exports = MultiFieldInputValidator;
