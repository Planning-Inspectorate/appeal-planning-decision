const {
	OptionsQuestion,
	optionIsDivider,
	conditionalIsJustHTML
} = require('../../options-question');
const questionUtils = require('../utils/question-utils');

const defaultOptionJoinString = ',';

/**
 * @typedef {import('../../journey').Journey} Journey
 */

/**
 * @typedef ConditionalAnswerObject
 * @type {object}
 * @property {string} value the checkbox answer
 * @property {string} conditional the conditional text input
 */

class CheckboxQuestion extends OptionsQuestion {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Array.<import('../../options-question').Option>} [params.options]
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 *
	 * @param {Record<string, Function>} [methodOverrides]
	 */
	constructor(
		{ title, question, fieldName, url, pageTitle, description, options, validators },
		methodOverrides
	) {
		super(
			{
				title,
				question,
				viewFolder: 'checkbox',
				fieldName,
				url,
				pageTitle,
				description,
				options,
				validators
			},
			methodOverrides
		);

		this.optionJoinString = defaultOptionJoinString;
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {string | ConditionalAnswerObject } answer will be a single value string, a comma-separated string representing multiple values (one of which may be a conditional) or a single ConditionalAnswerObject
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
		if (!answer) {
			return super.formatAnswerForSummary(sectionSegment, journey, answer, false);
		}

		// answer is single ConditionalAnswerObject
		if (typeof answer !== 'string') {
			/** @type {import('src/dynamic-forms/question-props').OptionWithoutDivider | undefined} */
			// @ts-ignore
			const selectedOption = this.options.find(
				(option) => !optionIsDivider(option) && option.value === answer.value
			);

			if (!selectedOption || conditionalIsJustHTML(selectedOption.conditional)) {
				throw new Error('No valid options matched answer option');
			}

			const conditionalAnswerText = selectedOption.conditional?.label
				? `${selectedOption.conditional.label} ${answer.conditional}`
				: answer.conditional;

			const formattedConditionalText = [selectedOption.text, conditionalAnswerText].join('\n');

			return super.formatAnswerForSummary(sectionSegment, journey, formattedConditionalText, false);
		}

		// answer is a string
		const answerArray = answer.split(this.optionJoinString);

		const formattedAnswer = this.options
			.filter((option) => !optionIsDivider(option) && answerArray.includes(option.value))
			.map(
				// @ts-ignore
				(/** @type {import('src/dynamic-forms/question-props').OptionWithoutDivider} */ option) => {
					if (option.conditional) {
						if (conditionalIsJustHTML(option.conditional)) return '';
						const conditionalAnswer =
							journey.response.answers[
								questionUtils.getConditionalFieldName(this.fieldName, option.conditional.fieldName)
							];
						return [option.text, conditionalAnswer].join('\n');
					}

					return option.text;
				}
			)
			.join('\n');

		return super.formatAnswerForSummary(sectionSegment, journey, formattedAnswer, false);
	}
}

module.exports = CheckboxQuestion;
