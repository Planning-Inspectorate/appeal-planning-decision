const Question = require('../../question');

/**
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 */

/**
 * @typedef {QuestionViewModel & { question: QuestionViewModel['question'] & { label?: string} }} ContinueViewModel
 */

class ContinueQuestion extends Question {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.description]
	 * @param {string} [params.url]
	 * @param {string|undefined} [params.label] if defined this show as a label for the input and the question will just be a standard h1
	 */
	constructor({ title, question, fieldName, url, label, description }) {
		super({
			title,
			viewFolder: 'continue',
			fieldName,
			url,
			question,
			description
		});

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
	 * @returns {ContinueViewModel}
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
		return {
			...viewModel,
			question: {
				...viewModel.question,
				label: questionLabel,
				value: questionValue,
				description: this.description
			}
		};
	}
}

module.exports = ContinueQuestion;
