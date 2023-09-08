const OptionsQuestion = require('../../options-question');

class CheckboxQuestion extends OptionsQuestion {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Array.<import('../../options-question').Option>} params.options
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor({ title, question, fieldName, url, pageTitle, description, options, validators }) {
		super({
			title,
			question,
			viewFolder: 'checkbox',
			fieldName,
			url,
			pageTitle,
			description,
			options,
			validators
		});
	}
}

module.exports = CheckboxQuestion;
