const { body } = require('express-validator');
const BaseValidator = require('./base-validator.js');

/**
 * @typedef {import('../question.js')} Question
 */

/**
 * enforces a field is not empty when condition is satisfied
 * @class
 */
class UnitOptionEntryValidator extends BaseValidator {
	/**
	 * @param {Object} params
	 * @param {string} [params.errorMessage]
	 * @param {string} [params.unit]
	 * @param {number} [params.min]
	 * @param {number} [params.max]
	 * @param {Regex} [params.regex]
	 * @param {string} [params.regexMessage]
	 */

	constructor({ errorMessage, unit, min, max, regex, regexMessage } = {}) {
		super();
		this.errorMessage = errorMessage || 'Enter a value';
		this.unit = unit || 'Input';
		this.min = min;
		this.max = max;
		this.regex = regex;
		this.regexMessage = regexMessage || 'Invalid input format';
	}

	/**
	 * validates the response body, checking the questionObj's fieldname
	 * @param {Question} questionObj
	 */
	validate(questionObj) {
		return questionObj.options.reduce((schema, option) => {
			schema.push(
				body(option.conditional.fieldName)
					.if(this.isValueIncluded(questionObj, option.value))
					.notEmpty()
					.withMessage(this.errorMessage)
			);

			if (this.regex) {
				schema.push(
					body(option.conditional.fieldName)
						.if(this.isValueIncluded(questionObj, option.value))
						.matches(new RegExp(this.regex))
						.withMessage(this.regexMessage)
				);
			}

			if (this.min !== undefined) {
				const minMessage = `${this.unit} must be at least ${this.min}${option.conditional.suffix}`;

				schema.push(
					body(option.conditional.fieldName)
						.if(this.isValueIncluded(questionObj, option.value))
						.isFloat({ min: this.min })
						.withMessage(minMessage)
				);
			}

			if (this.max !== undefined) {
				const maxMessage = `${this.unit} must be ${this.max.toLocaleString()}${
					option.conditional.suffix
				} or less`;

				schema.push(
					body(option.conditional.fieldName)
						.if(this.isValueIncluded(questionObj, option.value))
						.isFloat({ max: this.max })
						.withMessage(maxMessage)
				);
			}

			return schema;
		}, []);
	}

	isValueIncluded(questionObj, value) {
		return body(questionObj.fieldName).custom((existingValues) => {
			existingValues = Array.isArray(existingValues) ? existingValues : [existingValues];
			return existingValues.includes(value);
		});
	}
}

module.exports = UnitOptionEntryValidator;
