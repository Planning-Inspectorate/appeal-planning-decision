const { body } = require('express-validator');
const BaseValidator = require('./base-validator.js');

class StringValidator extends BaseValidator {
	regex = {
		regex: '',
		regexMessage: ''
	};
	minLength = {
		minLength: 0,
		minLengthMessage: ''
	};
	maxLength = {
		maxLength: 0,
		maxLengthMessage: ''
	};
	constructor({ regex, minLength, maxLength } = {}) {
		super();

		if (!regex && !minLength && !maxLength)
			throw new Error('String validator is invoked without any validations set!');
		if (regex && regex.regex) this.regex = regex;
		if (minLength && minLength.minLength) this.minLength = minLength;
		if (maxLength && maxLength.maxLength) this.maxLength = maxLength;
		this.regex.regexMessage = this.regex.regexMessage
			? this.regex.regexMessage
			: 'Please enter only the allowed characters';
		this.minLength.minLengthMessage = this.minLength.minLengthMessage
			? this.minLength.minLengthMessage
			: `Input too short - Please enter at least ${this.minLength.minLength} characters`;
		this.maxLength.maxLengthMessage = this.maxLength.maxLengthMessage
			? this.maxLength.maxLengthMessage
			: `Input too long - Please enter no more than ${this.maxLength.maxLength} characters`;
	}
	validate(questionObj) {
		const regexValidator = (chain) =>
			chain.matches(new RegExp(this.regex.regex)).withMessage(this.regex.regexMessage);
		const minLengthValidator = (chain) =>
			chain
				.isLength({ min: this.minLength.minLength })
				.withMessage(this.minLength.minLengthMessage);
		const maxLengthValidator = (chain) =>
			chain
				.isLength({ max: this.maxLength.maxLength })
				.withMessage(this.maxLength.maxLengthMessage);
		let chain = body(questionObj.fieldName);
		if (this.regex.regex) {
			chain = regexValidator(chain);
		}
		if (this.minLength.minLength) {
			chain = minLengthValidator(chain);
		}
		if (this.maxLength.maxLength) {
			chain = maxLengthValidator(chain);
		}
		return chain;
	}
}

module.exports = StringValidator;
