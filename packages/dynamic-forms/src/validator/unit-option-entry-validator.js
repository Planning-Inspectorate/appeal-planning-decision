const { body } = require('express-validator');
const BaseValidator = require('./base-validator.js');

/**
 * @typedef {import('../questions/question.js')} Question
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
	 * @param {RegExp} [params.regex]
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

			this.validateRegex(schema, option, this.regex, this.regexMessage, questionObj);

			this.validateMin(schema, option, this.min, questionObj);

			this.validateMax(schema, option, this.max, questionObj);

			if (option.validator) {
				option.validator?.regexps.forEach((regexValidator) => {
					this.validateRegex(
						schema,
						option,
						regexValidator.regex,
						regexValidator.regexMessage,
						questionObj
					);
				});
				this.validateMin(schema, option, option.validator.min, questionObj);
				this.validateMax(schema, option, option.validator.max, questionObj);
			}

			return schema;
		}, []);
	}

	validateRegex(schema, option, regex, regexMessage, questionObj) {
		if (regex) {
			schema.push(
				body(option.conditional.fieldName)
					.if(this.isValueIncluded(questionObj, option.value))
					.matches(new RegExp(regex))
					.withMessage(regexMessage)
			);
		}
	}

	validateMin(schema, option, min, questionObj) {
		if (min !== undefined) {
			const minMessage = `${this.unit} must be at least ${min.toString()}`;

			schema.push(
				body(option.conditional.fieldName)
					.if(this.isValueIncluded(questionObj, option.value))
					.isFloat({ min: min })
					.withMessage(minMessage)
			);
		}
	}

	validateMax(schema, option, max, questionObj) {
		if (max !== undefined) {
			const maxMessage = `${this.unit} must be ${max.toString()} or less`;
			console.log('my value: ', option.value);
			schema.push(
				body(option.conditional.fieldName)
					.if(this.isValueIncluded(questionObj, option.value))
					.isFloat({ max: max })
					.withMessage(maxMessage)
			);
		}
	}

	isValueIncluded(questionObj, value) {
		return body(questionObj.fieldName).custom((existingValues) => {
			existingValues = Array.isArray(existingValues) ? existingValues : [existingValues];
			return existingValues.includes(value);
		});
	}
}

module.exports = UnitOptionEntryValidator;
