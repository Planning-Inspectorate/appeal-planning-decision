const RadioQuestion = require('../radio/question');

/**
 * @typedef {import('../../options-question').OptionsViewModel} OptionsViewModel
 * @typedef {OptionsViewModel & { question: OptionsViewModel['question'] & { label?: string, legend?: string } }} RadioViewModel
 */

// The RadioQuestion type allows for specified options to have variable values
// This type allows for all of the options to be dynamically generated
class DynamicRadioQuestion extends RadioQuestion {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} params.dynamicOptionsVariable // string value which corresponds to the relevant section variable
	 * @param {string} [params.viewFolder]
	 * @param {string} [params.url]
	 * @param {string} [params.hint]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {string} [params.label]
	 * @param {string} [params.html]
	 * @param {Array<string>} [params.variables]
	 * @param {string} [params.legend] - optional legend, used instead of h1
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 *
	 * @param {Record<string, Function>} [methodOverrides]
	 */
	constructor(
		{
			title,
			question,
			fieldName,
			dynamicOptionsVariable,
			viewFolder,
			url,
			hint,
			pageTitle,
			description,
			label,
			html,
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
				validators,
				variables
			},
			methodOverrides
		);

		this.dynamicOptionsVariable = dynamicOptionsVariable;
		this.html = html;
		this.label = label;
		this.legend = legend;
	}

	/**
	 * adds label property to view model
	 * @param {Object} options - the current section
	 * @param {import('../../section').Section} options.section - the current section
	 * @param {import('../../journey').Journey} options.journey - the journey we are in
	 * @param {Record<string, unknown>} [options.customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [options.payload]
	 * @param {string} [options.sessionBackLink]
	 * @returns {OptionsViewModel}
	 */
	prepQuestionForRendering({ section, journey, customViewData, payload, sessionBackLink }) {
		const replacedDynamicOptions =
			!this.dynamicOptionsVariable || !section?.sectionVariables
				? []
				: section.sectionVariables[this.dynamicOptionsVariable];

		this.options = replacedDynamicOptions;

		/** @type {RadioViewModel} */
		const viewModel = super.prepQuestionForRendering({
			section,
			journey,
			customViewData,
			payload,
			sessionBackLink
		});

		return viewModel;
	}

	/**
	 * returns the data to send to the DB
	 * side effect: modifies journeyResponse with the new answers
	 * @param {import('express').Request} req
	 * @param {import('../../journey-response').JourneyResponse} journeyResponse - current journey response, modified with the new answers
	 * @returns {Promise<{ answers: Record<string, unknown> }>}
	 */
	async getDataToSave(req, journeyResponse) {
		/**
		 * @type {{ answers: Record<string, unknown> }}
		 */
		let responseToSave = { answers: {} };

		const fieldValue = req.body[this.fieldName]?.trim();

		if (fieldValue === 'None') {
			responseToSave.answers[this.fieldName] = false;
			journeyResponse.answers[this.fieldName] = 'no';
		} else {
			const parsedNameArray = fieldValue.split('_');
			const firstName = parsedNameArray[0];
			const lastName = parsedNameArray[1];

			responseToSave.answers[this.fieldName] = true;
			responseToSave.answers['appellantFirstName'] = firstName;
			responseToSave.answers['appellantLastName'] = lastName;

			journeyResponse.answers[this.fieldName] = 'yes';
			journeyResponse.answers['appellantFirstName'] = firstName;
			journeyResponse.answers['appellantLastName'] = lastName;
		}

		return responseToSave;
	}
}

module.exports = DynamicRadioQuestion;
