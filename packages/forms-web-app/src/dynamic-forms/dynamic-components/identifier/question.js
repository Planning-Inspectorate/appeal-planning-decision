const Question = require('../../question');

class IdentifierQuestion extends Question {
	/** @type {string|undefined} page h1, optional, will default to use question's label */
	pageHeading;
	/** @type {string} css classes to apply to input element */
	inputClasses;

	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {string} [params.html]
	 * @param {string} [params.hint]
	 * @param {string} [params.inputClasses]
	 * @param {string|undefined} [params.pageHeading]
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
		html,
		hint,
		inputClasses = 'govuk-input--width-10',
		pageHeading
	}) {
		super({
			title,
			question,
			viewFolder: 'identifier',
			fieldName,
			url,
			pageTitle,
			description,
			validators,
			html,
			hint
		});

		this.inputClasses = inputClasses;
		this.pageHeading = pageHeading;
	}

	/**
	 * adds custom identifier info to view model
	 */
	prepQuestionForRendering(section, journey, customViewData) {
		let viewModel = super.prepQuestionForRendering(section, journey, customViewData);
		viewModel.question.inputClasses = this.inputClasses;
		viewModel.question.pageHeading = this.pageHeading;
		return viewModel;
	}
}

module.exports = IdentifierQuestion;
