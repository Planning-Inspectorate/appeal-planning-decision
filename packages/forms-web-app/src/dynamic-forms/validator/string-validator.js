const { body } = require('express-validator');
const BaseValidator = require('./base-validator.js');

class StringValidator extends BaseValidator {
	minLength = {
		minLength: 0,
		minLengthMessage: ''
	};
	maxLength = {
		maxLength: 0,
		maxLengthMessage: ''
	};
	regex = {
		regex: '',
		regexMessage: ''
	};
	constructor({ minLength, maxLength, regex } = {}) {
		super();

		if (!minLength && !maxLength && !regex)
			throw new Error('String validator is invoked without any validations set!');
		if (minLength && minLength.minLength) this.minLength = minLength;
		if (maxLength && maxLength.maxLength) this.maxLength = maxLength;
		if (regex && regex.regex) this.regex = regex;
		this.minLength.minLengthMessage = this.minLength.minLengthMessage
			? this.minLength.minLengthMessage
			: `Input too short - Please enter at least ${this.minLength.minLength} characters`;
		this.maxLength.maxLengthMessage = this.maxLength.maxLengthMessage
			? this.maxLength.maxLengthMessage
			: `Input too long - Please enter no more than ${this.maxLength.maxLength} characters`;
		this.regex.regexMessage = this.regex.regexMessage
			? this.regex.regexMessage
			: 'Please enter only the allowed characters';
	}
	validate(questionObj) {
		const minLengthValidator = (chain) =>
			chain
				.isLength({ min: this.minLength.minLength })
				.withMessage(this.minLength.minLengthMessage);
		const maxLengthValidator = (chain) =>
			chain
				.isLength({ max: this.maxLength.maxLength })
				.withMessage(this.maxLength.maxLengthMessage);
		const regexValidator = (chain) =>
			chain.matches(new RegExp(this.regex.regex)).withMessage(this.regex.regexMessage);

		let chain = body(questionObj.fieldName);
		if (this.minLength.minLength) {
			chain = minLengthValidator(chain);
		}
		if (this.maxLength.maxLength) {
			chain = maxLengthValidator(chain);
		}
		if (this.regex.regex) {
			chain = regexValidator(chain);
		}
		return chain;
	}
}

module.exports = StringValidator;
