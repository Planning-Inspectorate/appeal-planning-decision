const { OptionsQuestion } = require('../../options-question');

/**
 * @typedef {import('../../options-question').OptionsViewModel} OptionsViewModel
 * @typedef {OptionsViewModel & { question: OptionsViewModel['question'] & { label?: string, legend?: string } }} RadioViewModel
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
	 * @param {Array<string>} [params.variables]
	 * @param {string} [params.legend] - optional legend, used instead of h1
	 * @param {Array.<import('../../options-question').Option>} [params.options]
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 * @param {object} [params.customData]
	 *
	 * @param {Record<string, Function>} [methodOverrides]
	 */
	constructor(params, methodOverrides) {
		super(
			{
				...params,
				viewFolder: !params.viewFolder ? 'radio' : params.viewFolder
			},
			methodOverrides
		);

		this.html = params.html;
		this.label = params.label;
		this.legend = params.legend;
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
