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
	 * @param {string} [params.inputClasses] css class string to be added to the input
	 * @param {string|undefined} [params.label] if defined this show as a label for the input and the question will just be a standard h1
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
		label
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
		this.label = label;
	}

	/**
	 * adds custom identifier info to view model
	 */
	prepQuestionForRendering(section, journey, customViewData, payload) {
		let viewModel = super.prepQuestionForRendering(section, journey, customViewData);
		viewModel.question.inputClasses = this.inputClasses;
		viewModel.question.label = this.label;
		viewModel.question.value = payload
			? payload[viewModel.question.fieldName]
			: viewModel.question.value;
		return viewModel;
	}
}

module.exports = IdentifierQuestion;
