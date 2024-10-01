const {
	OptionsQuestion,
	optionIsDivider,
	conditionalIsJustHTML
} = require('../../options-question');

/**
 * @typedef {import('../../options-question').OptionsViewModel} OptionsViewModel
 * @typedef {OptionsViewModel & { question: OptionsViewModel['question'] & { label?: string } }} RadioViewModel
 */

class RadioQuestion extends OptionsQuestion {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.viewFolder]
	 * @param {string} [params.url]
	 * @param {string} [params.hint]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {string} [params.label]
	 * @param {string} [params.html]
	 * @param {Array.<import('../../options-question').Option>} [params.options]
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 *
	 * @param {Record<string, Function>} [methodOverrides]
	 */
	constructor(
		{
			title,
			question,
			fieldName,
			viewFolder,
			url,
			hint,
			pageTitle,
			description,
			label,
			html,
			options,
			validators
		},
		methodOverrides
	) {
		super(
			{
				title,
				question,
				viewFolder: !viewFolder ? 'radio' : viewFolder,
				fieldName,
				url,
				hint,
				pageTitle,
				description,
				options,
				validators
			},
			methodOverrides
		);

		this.html = html;
		this.label = label;
	}

	/**
	 * adds label property to view model
	 * @param {import('../../section').Section} section - the current section
	 * @param {import('../../journey').Journey} journey - the journey we are in
	 * @param {Record<string, unknown>} [customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [payload]
	 * @returns {RadioViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData, payload) {
		/** @type {RadioViewModel} */
		let viewModel = super.prepQuestionForRendering(section, journey, customViewData, payload);
		viewModel.question.label = this.label;
		return viewModel;
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {string | import('../../options-question').OptionWithoutDivider} answer
	 * @param {import('../../journey').Journey} journey
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
		if (typeof answer === 'string')
			return super.formatAnswerForSummary(sectionSegment, journey, answer);

		/** @type {import('../../options-question').OptionWithoutDivider | undefined} */
		// @ts-ignore
		const selectedOption = this.options.find(
			(option) => !optionIsDivider(option) && option.value === answer.value
		);

		const conditionalAnswerText = (() => {
			if (!selectedOption?.conditional || conditionalIsJustHTML(selectedOption.conditional))
				return answer.conditional;
			return `${selectedOption.conditional.label} ${answer.conditional}`;
		})();

		const formattedAnswer = [selectedOption?.text, conditionalAnswerText].join('\n');
		return super.formatAnswerForSummary(sectionSegment, journey, formattedAnswer, false);
	}
}

module.exports = RadioQuestion;
