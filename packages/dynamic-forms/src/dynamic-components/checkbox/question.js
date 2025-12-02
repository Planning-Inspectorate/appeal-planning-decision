const { OptionsQuestion } = require('../../options-question');

const defaultOptionJoinString = ',';

/**
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
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
	 * @param {JourneyResponse} [response]
	 *
	 * @param {Record<string, Function>} [methodOverrides]
	 */
	constructor(
		{ title, question, fieldName, url, pageTitle, description, options, validators },
		response,
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
			response,
			methodOverrides
		);

		this.optionJoinString = defaultOptionJoinString;
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {string | ConditionalAnswerObject | null } answer will be a single value string, a comma-separated string representing multiple values (one of which may be a conditional) or a single ConditionalAnswerObject
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

module.exports = CheckboxQuestion;
