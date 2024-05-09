const Question = require('../../question');

/**
 * @typedef {import('../../journey').Journey} Journey
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
	constructor({ title, question, fieldName, url, hint, label, html, validators, suffix }) {
		super({
			title,
			question,
			viewFolder: 'number-entry',
			fieldName,
			url,
			hint,
			validators,
			html
		});

		this.suffix = suffix;
		this.label = label;
	}

	/**
	 * adds label and suffix property to view model
	 */
	prepQuestionForRendering(section, journey, customViewData, payload) {
		let viewModel = super.prepQuestionForRendering(section, journey, customViewData, payload);

		viewModel.question.label = this.label;
		viewModel.question.suffix = this.suffix;

		return viewModel;
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {Object} answer
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
