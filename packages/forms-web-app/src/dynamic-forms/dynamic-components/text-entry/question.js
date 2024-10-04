const Question = require('../../question');

/**
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 */

/**
 * @typedef {Object} TextEntryCheckbox
 * @property {string} header
 * @property {string} text
 * @property {string} name
 * @property {string} [errorMessage]
 */

/**
 * @typedef {QuestionViewModel & { question: QuestionViewModel['question'] & { label?: string, textEntryCheckbox?: TextEntryCheckbox } }} TextEntryViewModel
 */

class TextEntryQuestion extends Question {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.html]
	 * @param {string} [params.hint]
	 * @param {TextEntryCheckbox} [params.textEntryCheckbox]
	 * @param {string|undefined} [params.label] if defined this show as a label for the input and the question will just be a standard h1
	 * @param {Array.<import('../../validator/base-validator')>} [params.validators]
	 */
	constructor({
		title,
		question,
		fieldName,
		url,
		hint,
		validators,
		html,
		textEntryCheckbox,
		label
	}) {
		super({
			title,
			viewFolder: 'text-entry',
			fieldName,
			url,
			question,
			validators,
			hint,
			html
		});

		this.textEntryCheckbox = textEntryCheckbox;
		this.label = label;
	}

	/**
	 * gets the view model for this question
	 * @param {Section} section - the current section
	 * @param {Journey} journey - the journey we are in
	 * @param {Record<string, unknown>} [customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [payload]
	 * @returns {TextEntryViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData, payload) {
		let viewModel = super.prepQuestionForRendering(section, journey, customViewData);
		const questionLabel = this.label;
		const questionValue = payload
			? payload[viewModel.question.fieldName]
			: viewModel.question.value;
		const questionTextEntryCheckbox = this.textEntryCheckbox;
		return {
			...viewModel,
			question: {
				...viewModel.question,
				label: questionLabel,
				value: questionValue,
				textEntryCheckbox: questionTextEntryCheckbox
			}
		};
	}
}

module.exports = TextEntryQuestion;
