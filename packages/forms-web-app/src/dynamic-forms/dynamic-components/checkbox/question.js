const OptionsQuestion = require('../../options-question');
const questionUtils = require('../utils/question-utils');

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

		let formattedAnswerArray = [];

		answer.forEach((answer) => {
			if (answer?.conditional) {
				const selectedOption = this.options.find((option) => option.value === answer.value);

				const conditionalAnswerText = selectedOption.conditional?.label
					? `${selectedOption.conditional.label} ${answer.conditional}`
					: answer.conditional;

				const formattedConditionalText = [selectedOption.text, conditionalAnswerText].join('<br>');

				formattedAnswerArray.push(formattedConditionalText);
			} else {
				const selectedOption = this.options.find((option) => option.value === answer);

				const conditionalAnswer = questionUtils.getConditionalAnswer(
					journey.response.answers,
					this,
					answer
				);

				if (conditionalAnswer) {
					const formattedBlag = [selectedOption.text, conditionalAnswer].join('<br>');

					formattedAnswerArray.push(formattedBlag);
				} else {
					formattedAnswerArray.push(selectedOption.text);
				}
			}
		});
		const formattedAnswer = formattedAnswerArray.join('<br>');

		return super.formatAnswerForSummary(sectionSegment, journey, formattedAnswer, false);
	}
}

module.exports = CheckboxQuestion;
