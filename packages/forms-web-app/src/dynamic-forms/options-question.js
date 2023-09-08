const Question = require('./question');

const ValidOptionValidator = require('./validator/valid-option-validator');

/**
 * @typedef {Object} Option
 * @property {string} text - text shown to user
 * @property {string} value - value on form
 */

class OptionsQuestion extends Question {
	/** @type {Array.<Option>} */
	options;

	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.viewFolder
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Array.<Option>} params.options
	 * @param {Array.<import('./question').BaseValidator>} [params.validators]
	 */
	constructor({
		title,
		question,
		viewFolder,
		fieldName,
		url,
		pageTitle,
		description,
		options,
		validators
	}) {
		// add default valid options validator to all options questions
		let optionsValidators = [new ValidOptionValidator()];
		if (validators && Array.isArray(validators)) {
			optionsValidators = validators.concat(optionsValidators);
		}

		super({
			title,
			question,
			viewFolder,
			fieldName,
			url,
			pageTitle,
			description,
			validators: optionsValidators
		});
		this.options = options;
	}
}

module.exports = OptionsQuestion;
