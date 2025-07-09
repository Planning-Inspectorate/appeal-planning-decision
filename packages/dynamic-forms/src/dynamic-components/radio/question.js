const { OptionsQuestion } = require('../../questions/options-question');

/**
 * @typedef {import('../../questions/options-question').OptionsViewModel} OptionsViewModel
 * @typedef {OptionsViewModel & { question: OptionsViewModel['question'] & { label?: string, legend?: string } }} RadioViewModel
 */

class RadioQuestion extends OptionsQuestion {
	/**
	 * @typedef {string} legend // optional legend, used instead of h1
	 * @param {import('#question-types').OptionsQuestionParameters & {
	 *  label?: string,
	 *  legend?: legend
	 * }} params
	 * @param {import('#question-types').MethodOverrides} [methodOverrides]
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
			validators,
			legend,
			variables
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
				validators,
				variables
			},
			methodOverrides
		);

		this.html = html;
		this.label = label;
		this.legend = legend;
	}

	/**
	 * adds label property to view model
	 * @param {Object} options
	 * @param {import('../../section').Section} options.section - the current section
	 * @param {import('../../journey').Journey} options.journey - the journey we are in
	 * @param {Record<string, unknown>} [options.customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [options.payload]
	 * @param {string} [options.sessionBackLink]
	 * @returns {RadioViewModel}
	 */
	prepQuestionForRendering({ section, journey, customViewData, payload, sessionBackLink }) {
		/** @type {RadioViewModel} */
		let viewModel = super.prepQuestionForRendering({
			section,
			journey,
			customViewData,
			payload,
			sessionBackLink
		});
		viewModel.question.label = this.label;
		viewModel.question.legend = this.legend;
		return viewModel;
	}
}

module.exports = RadioQuestion;
