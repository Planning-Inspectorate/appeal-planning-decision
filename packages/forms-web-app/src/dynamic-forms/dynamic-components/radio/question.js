const OptionsQuestion = require('../../options-question');

class RadioQuestion extends OptionsQuestion {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.viewFolder]
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Array.<import('../../options-question').Option>} params.options
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor({
		title,
		question,
		fieldName,
		viewFolder,
		url,
		pageTitle,
		description,
		options,
		validators
	}) {
		super({
			title,
			question,
			viewFolder: !viewFolder ? 'radio' : viewFolder,
			fieldName,
			url,
			pageTitle,
			description,
			options,
			validators
		});
	}
}

module.exports = RadioQuestion;
