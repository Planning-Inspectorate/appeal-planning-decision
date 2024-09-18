const nunjucks = require('nunjucks');
const Question = require('../../question');

const defaultOptionJoinString = ',';

/**
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 */

/**
 * UnitOptions are the options displayed in the radio format - in this case the value
 * represents the unit.
 * Conditionals must be used to capture the relevant quantity.
 * Each conditional must have a fieldName which uses the conditionalFieldName from the
 * UnitOptionEntryQuestion object as a base, followed by an underscore and unit reference
 * eg 'siteAreaSquareMetres_hectares' - this is required for validation and saving to the DB
 * @typedef {{
 *   text: string;
 *   value: string;
 * 	 hint?: object;
 *   checked?: boolean | undefined;
 *   attributes?: Record<string, string>;
 *   behaviour?: 'exclusive';
 *   conditional: {
 *     fieldName: string;
 * 		 suffix: string;
 *     value?: unknown;
 * 		 label?: string;
 * 		 hint?: string;
 *     conversionFactor?: number;
 *   }
 *}} UnitOption
 */

class UnitOptionEntryQuestion extends Question {
	/** @type {Array<UnitOption>} */
	options;

	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName // will be the unit type eg square metres, hectares
	 * @param {string} params.conditionalFieldName // will be the quantity and is captured by the conditional in the options
	 * @param {string} [params.viewFolder]
	 * @param {string} [params.url]
	 * @param {string} [params.hint]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {string} [params.label]
	 * @param {string} [params.html]
	 * @param {Array.<UnitOption>} params.options
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor({
		title,
		question,
		fieldName,
		conditionalFieldName,
		viewFolder,
		url,
		hint,
		pageTitle,
		description,
		label,
		html,
		options,
		validators
	}) {
		super({
			title,
			question,
			viewFolder: !viewFolder ? 'unit-option-entry' : viewFolder,
			fieldName,
			url,
			hint,
			pageTitle,
			description,
			validators
		});

		this.conditionalFieldName = conditionalFieldName;
		this.options = options;
		this.html = html;
		this.label = label;
		this.optionJoinString = defaultOptionJoinString;
	}

	/**
	 * gets the view model for this question
	 * @param {Section} section - the current section
	 * @param {Journey} journey - the journey we are in
	 * @param {Record<string, unknown>} [customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [payload]
	 * @returns {QuestionViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData, payload) {
		const answer = payload
			? payload[this.fieldName]
			: journey.response.answers[this.fieldName] || '';

		const viewModel = super.prepQuestionForRendering(section, journey, customViewData, payload);

		viewModel.question.options = [];

		for (const option of this.options) {
			let optionData = { ...option };
			if (optionData.value !== undefined) {
				optionData.checked = (',' + answer + ',').includes(',' + optionData.value + ',');
				if (!optionData.attributes) {
					optionData.attributes = { 'data-cy': 'answer-' + optionData.value };
				}
			}

			// handle conditional (dependant) fields & set their answers
			if (optionData.conditional !== undefined) {
				let conditionalField = { ...optionData.conditional };

				const conversionFactor = conditionalField.conversionFactor || 1;

				const existingValue =
					answer === optionData.value
						? journey.response.answers[this.conditionalFieldName] / conversionFactor
						: '';

				conditionalField.value = payload ? payload[conditionalField.fieldName] : existingValue;

				optionData.conditional = {
					html: nunjucks.render(`./dynamic-components/conditional/unit.njk`, {
						payload,
						...conditionalField,
						...customViewData
					})
				};
			}

			viewModel.question.options.push(optionData);
		}

		return viewModel;
	}

	/**
	 * returns the data to send to the DB
	 * side effect: modifies journeyResponse with the new answers
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
	 * @returns {Promise<{ answers: Record<string, unknown> }>}
	 */
	async getDataToSave(req, journeyResponse) {
		/**
		 * @type {{ answers: Record<string, unknown> }}
		 */
		let responseToSave = { answers: {} };

		const fields = Array.isArray(req.body[this.fieldName])
			? req.body[this.fieldName]
			: [req.body[this.fieldName]];
		const fieldValues = fields.map((x) => x.trim());

		const selectedOptions = this.options.filter(({ value }) => {
			return fieldValues.includes(value);
		});

		if (!selectedOptions.length)
			throw new Error(
				`User submitted option(s) did not correlate with valid answers to ${this.fieldName} question`
			);

		responseToSave.answers[this.fieldName] = fieldValues.join(this.optionJoinString);
		journeyResponse.answers[this.fieldName] = fieldValues;

		this.options.forEach((option) => {
			if (!option.conditional) return;
			const optionIsSelectedOption = selectedOptions.some(
				(selectedOption) =>
					option.text === selectedOption.text && option.value === selectedOption.value
			);

			if (optionIsSelectedOption) {
				const conversionFactor = option.conditional.conversionFactor || 1;
				const value = req.body[option.conditional.fieldName] * conversionFactor;
				responseToSave.answers[this.conditionalFieldName] = value;
				journeyResponse.answers[this.conditionalFieldName] = value;
			}
		});

		return responseToSave;
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * Note that the 'answer' will be the unit, and it is necessary to retrieve the quantity
	 * @param {Object} answer
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {Array.<Object>}
	 */
	formatAnswerForSummary(sectionSegment, journey, answer) {
		if (answer == null) return super.formatAnswerForSummary(sectionSegment, journey, answer);

		const selectedOption = this.options.find((option) => option.value === answer);
		const conversionFactor = selectedOption?.conditional.conversionFactor || 1;

		const answerQuantity = journey.response?.answers[this.conditionalFieldName] / conversionFactor;

		const formattedAnswer = `${answerQuantity} ${answer}`;
		return super.formatAnswerForSummary(sectionSegment, journey, formattedAnswer, false);
	}
}

module.exports = UnitOptionEntryQuestion;
