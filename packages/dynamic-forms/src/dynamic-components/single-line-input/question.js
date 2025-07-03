const Question = require('../../questions/question');

/**
 * @typedef {import('../../questions/question').QuestionViewModel} QuestionViewModel
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 * @typedef {import('../../validator/base-validator')} BaseValidator
 * @typedef {string} label // if defined this show as a label for the input and the question will just be a standard h1
 * @typedef {Record<string, string>} inputAttributes // html attributes to add to the input
 */

/**
 * @typedef {QuestionViewModel & { question: QuestionViewModel['question'] & { label?: label, attributes?: inputAttributes } }} SingleLineViewModel
 */

/**
 * @class
 */
class SingleLineInputQuestion extends Question {
	/** @type {Record<string, string>} */
	inputAttributes;

	/**
	 * @param {import('#question-types').QuestionParameters & {
	 *  label?: label,
	 *  inputAttributes?: inputAttributes
	 * }} params
	 */
	constructor(params) {
		super({
			...params,
			viewFolder: 'single-line-input'
		});

		this.label = params.label;
		this.inputAttributes = params.inputAttributes || {};
	}

	/**
	 * gets the view model for this question
	 * @param {Object} options
	 * @param {Section} options.section - the current section
	 * @param {Journey} options.journey - the journey we are in
	 * @param {Record<string, unknown>} [options.customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [options.payload]
	 * @param {string} [options.sessionBackLink]
	 * @returns {SingleLineViewModel}
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
		const questionAttributes = this.inputAttributes;
		return {
			...viewModel,
			question: {
				...viewModel.question,
				label: questionLabel,
				value: questionValue,
				attributes: questionAttributes
			}
		};
	}
}

module.exports = SingleLineInputQuestion;
