const Question = require('../../question');
const { getPersistedNumberAnswer } = require('../utils/persisted-number-answer');

/**
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel

 * @typedef {QuestionViewModel & { answer?: string | number, question: QuestionViewModel['question'] & { label?: string, suffix?: string } }} NumberViewModel
 */

class NumberEntryQuestion extends Question {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.html]
	 * @param {string} [params.hint]
	 * @param {string} [params.suffix]
	 * @param {string|undefined} [params.label] if defined this show as a label for the input and the question will just be a standard h1
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor(params) {
		super({
			...params,
			viewFolder: 'number-entry'
		});

		this.suffix = params.suffix;
		this.label = params.label;
	}

	/**
	 * adds label and suffix property to view model
	 * @param {Object} options - the current section
	 * @param {import('../../section').Section} options.section - the current section
	 * @param {import('../../journey').Journey} options.journey - the journey we are in
	 * @param {Record<string, unknown>} [options.customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [options.payload]
	 * @param {string} [options.sessionBackLink]
	 * @returns {NumberViewModel}
	 */
	prepQuestionForRendering({ section, journey, customViewData, payload, sessionBackLink }) {
		let viewModel = super.prepQuestionForRendering({
			section,
			journey,
			customViewData,
			payload,
			sessionBackLink
		});

		const answer = journey.response.answers[this.fieldName];
		const persistedAnswer = getPersistedNumberAnswer(answer);
		const questionValue = payload ? payload[this.fieldName] : persistedAnswer;
		return {
			...viewModel,
			question: {
				...viewModel.question,
				value: questionValue,
				label: this.label,
				suffix: this.suffix
			}
		};
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {string | null} answer
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {Array<{
	 *   key: string;
	 *   value: string | Object;
	 *   action: {
	 *     href: string;
	 *     text: string;
	 *     visuallyHiddenText: string;
	 *   };
	 * }>}
	 */
	formatAnswerForSummary(sectionSegment, journey, answer) {
		return super.formatAnswerForSummary(sectionSegment, journey, answer, false);
	}
}

module.exports = NumberEntryQuestion;
