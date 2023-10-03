const RadioQuestion = require('../radio/question');

class BooleanTextQuestion extends RadioQuestion {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.html]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {string} [params.label]
	 * @param {Array.<Option>} [params.options]
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor({
		title,
		question,
		fieldName,
		url,
		pageTitle,
		description,
		validators,
		options,
		html,
		label
	}) {
		super({
			title,
			question,
			viewFolder: 'boolean-text',
			fieldName,
			url,
			pageTitle,
			description,
			options,
			validators
		});

		this.html = html;
		this.label = label;
	}

	/**
	 * adds label property to view model
	 */
	prepQuestionForRendering(section, journey, customViewData) {
		let viewModel = super.prepQuestionForRendering(section, journey, customViewData);
		viewModel.question.label = this.label;
		return viewModel;
	}
}

module.exports = BooleanTextQuestion;
