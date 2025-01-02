const Question = require('../../question');

/**
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 * @typedef {import('../../validator/base-validator')} BaseValidator
 */

/**
 * @typedef {QuestionViewModel & { question: QuestionViewModel['question'] & { label?: string, attributes?: Record<string, string> } }} SingleLineViewModel
 */

/**
 * @class
 */
class SingleLineInputQuestion extends Question {
	/** @type {Record<string, string>} */
	inputAttributes;

	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.description]
	 * @param {string} [params.url]
	 * @param {string} [params.html]
	 * @param {string} [params.hint]
	 * @param {string|undefined} [params.label] if defined this show as a label for the input and the question will just be a standard h1
	 * @param {Array.<BaseValidator>} [params.validators]
	 * @param {Record<string, string>} [params.inputAttributes] html attributes to add to the input
	 * @param {boolean} [params.taskList]
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
	 * @param {Section} section - the current section
	 * @param {Journey} journey - the journey we are in
	 * @param {Record<string, unknown>} [customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [payload]
	 * @returns {SingleLineViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData, payload) {
		let viewModel = super.prepQuestionForRendering(section, journey, customViewData);
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
