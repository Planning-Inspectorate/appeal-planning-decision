const { body } = require('express-validator');
const BaseValidator = require('./base-validator.js');

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

class WordValidator extends BaseValidator {
	minLength = {
		minLength: 0,
		minLengthMessage: ''
	};
	maxLength = {
		maxLength: 0,
		maxLengthMessage: ''
	};

	/**
	 * @param {Object} params
	 * @param {MinLength} [params.minLength]
	 * @param {MaxLength} [params.maxLength]
	 * @param {string} [params.fieldName]
	 */
	constructor({ minLength, maxLength, fieldName } = {}) {
		super();

		if (!minLength && !maxLength)
			throw new Error('Word validator is invoked without any validations set!');
		if (minLength) this.minLength = minLength;
		if (maxLength) this.maxLength = maxLength;
		this.minLength.minLengthMessage = this.minLength.minLengthMessage
			? this.minLength.minLengthMessage
			: `Input too short - Please enter at least ${this.minLength.minLength} words`;
		this.maxLength.maxLengthMessage = this.maxLength.maxLengthMessage
			? this.maxLength.maxLengthMessage
			: `Input too long - Please enter no more than ${this.maxLength.maxLength} words`;
		this.fieldName = fieldName;
	}
	validate(questionObj) {
		const minLengthValidator = (chain) =>
			chain
				.custom((value) => {
					const wordCount = value.trim().split(/\s+/).length;
					return wordCount >= this.minLength.minLength;
				})
				.withMessage(this.minLength.minLengthMessage);
		const maxLengthValidator = (chain) =>
			chain
				.custom((value) => {
					const wordCount = value.trim().split(/\s+/).length;
					return wordCount <= this.maxLength.maxLength;
				})
				.withMessage(this.minLength.minLengthMessage);

		let chain = body(this.fieldName ? this.fieldName : questionObj.fieldName);
		if (this.minLength.minLength) {
			chain = minLengthValidator(chain);
		}
		if (this.maxLength.maxLength) {
			chain = maxLengthValidator(chain);
		}
		return chain;
	}
}

module.exports = WordValidator;
