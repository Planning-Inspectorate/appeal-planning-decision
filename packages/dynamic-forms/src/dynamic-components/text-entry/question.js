const Question = require('../../questions/question');

/**
 * @typedef {import('../../questions/question').QuestionViewModel} QuestionViewModel
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
	 * @param {import('#question-types').QuestionParameters & {
	 *  textEntryCheckbox?: TextEntryCheckbox,
	 *  label?: string
	 * }} params
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
	 * @param {Object} options - the current section
	 * @param {Section} options.section - the current section
	 * @param {Journey} options.journey - the journey we are in
	 * @param {Record<string, unknown>} [options.customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [options.payload]
	 * @param {string} [options.sessionBackLink]
	 * @returns {TextEntryViewModel}
	 */
	prepQuestionForRendering({ section, journey, customViewData, payload, sessionBackLink }) {
		let viewModel = super.prepQuestionForRendering({
			section,
			journey,
			customViewData,
			sessionBackLink
		});
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
