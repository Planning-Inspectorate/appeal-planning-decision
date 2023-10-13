const OptionsQuestion = require('../../options-question');

class CheckboxQuestion extends OptionsQuestion {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Array.<import('../../options-question').Option>} params.options
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor({ title, question, fieldName, url, pageTitle, description, options, validators }) {
		super({
			title,
			question,
			viewFolder: 'checkbox',
			fieldName,
			url,
			pageTitle,
			description,
			options,
			validators
		});
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {Object} answer
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {Array.<Object>}
	 */
	formatAnswerForSummary(sectionSegment, journey, answer) {
		answer = Array.isArray(answer) ? answer : [answer];
		const formattedAnswer = this.options
			.filter((option) => answer.includes(option.value))
			.map((option) => option.text)
			.join('<br>');

		return super.formatAnswerForSummary(sectionSegment, journey, formattedAnswer, false);
	}
}

module.exports = CheckboxQuestion;
