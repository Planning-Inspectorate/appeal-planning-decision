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
	 * @param {string} [params.label]
	 * @param {string} [params.html]
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
		label,
		html,
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

module.exports = RadioQuestion;
