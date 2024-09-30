const nunjucks = require('nunjucks');
const Question = require('./question');

const ValidOptionValidator = require('./validator/valid-option-validator');
const { getConditionalFieldName } = require('./dynamic-components/utils/question-utils');

const defaultOptionJoinString = ',';

/**
 * @typedef {import('./question').QuestionViewModel} QuestionViewModel
 * @typedef {import('./journey').Journey} Journey
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('./section').Section} Section
 * @typedef {import('./question-props').Option} Option
 * @typedef {import('./question-props').OptionWithoutDivider} OptionWithoutDivider
 */

/**
 * @typedef {QuestionViewModel & { question: QuestionViewModel['question'] & { options?: Option[] } }} OptionsViewModel
 */

class OptionsQuestion extends Question {
	/** @type {Array<Option>} */
	options;

	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.viewFolder
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.hint]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Array<Option>} [params.options]
	 * @param {Array<import('./question').BaseValidator>} [params.validators]
	 *
	 * @param {Record<string, Function>} [methodOverrides]
	 */
	constructor(
		{
			title,
			question,
			viewFolder,
			fieldName,
			url,
			hint,
			pageTitle,
			description,
			options,
			validators
		},
		methodOverrides
	) {
		// add default valid options validator to all options questions
		let optionsValidators = [new ValidOptionValidator()];
		if (validators && Array.isArray(validators)) {
			optionsValidators = validators.concat(optionsValidators);
		}

		super(
			{
				title,
				question,
				viewFolder,
				fieldName,
				url,
				hint,
				pageTitle,
				description,
				validators: optionsValidators
			},
			methodOverrides
		);
		this.hint = hint;
		this.options = options || [];
		this.optionJoinString = defaultOptionJoinString;
	}

	/**
	 * gets the view model for this question
	 * @param {Section} section - the current section
	 * @param {Journey} journey - the journey we are in
	 * @param {Record<string, unknown>} [customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [payload]
	 * @returns {OptionsViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData, payload) {
		const answer = payload
			? payload[this.fieldName]
			: journey.response.answers[this.fieldName] || '';

		/** @type {OptionsViewModel} */
		const viewModel = super.prepQuestionForRendering(section, journey, customViewData, payload);
		viewModel.question.options = [];

		for (const option of this.options) {
			let optionData = { ...option };
			// Skip if the option is a divider
			if (optionIsDivider(optionData)) continue;

			if (optionData.value !== undefined) {
				optionData.checked = (',' + answer + ',').includes(',' + optionData.value + ',');
				if (!optionData.attributes) {
					optionData.attributes = { 'data-cy': 'answer-' + optionData.value };
				}
			}

			// handle conditional (dependant) fields & set their answers
			if (optionData.conditional !== undefined) {
				if (conditionalIsJustHTML(optionData.conditional)) continue;

				let conditionalField = { ...optionData.conditional };

				conditionalField.fieldName = getConditionalFieldName(
					this.fieldName,
					conditionalField.fieldName
				);
				conditionalField.value = payload
					? payload[conditionalField.fieldName]
					: journey.response.answers[conditionalField.fieldName] || '';

				optionData.conditional = {
					html: nunjucks.render(`./dynamic-components/conditional/${conditionalField.type}.njk`, {
						payload,
						...conditionalField,
						...customViewData
					})
				};
			}

			// handles conditional text only - if using conditional question the use conditional field
			if (optionData.conditionalText !== undefined) {
				optionData.conditional = optionData.conditionalText;
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

		/** @type {OptionWithoutDivider[]} */
		// @ts-ignore
		const selectedOptions = this.options.filter((option) => {
			return !optionIsDivider(option) && fieldValues.includes(option.value);
		});

		if (!selectedOptions.length)
			throw new Error(
				`User submitted option(s) did not correlate with valid answers to ${this.fieldName} question`
			);

		responseToSave.answers[this.fieldName] = fieldValues.join(this.optionJoinString);
		journeyResponse.answers[this.fieldName] = fieldValues;

		this.options.forEach((option) => {
			if (optionIsDivider(option)) return;
			if (!option.conditional || conditionalIsJustHTML(option.conditional)) return;
			const key = getConditionalFieldName(this.fieldName, option.conditional.fieldName);
			const optionIsSelectedOption = selectedOptions.some(
				(selectedOption) =>
					option.text === selectedOption.text && option.value === selectedOption.value
			);

			const value = optionIsSelectedOption ? req.body[key]?.trim() : null;
			responseToSave.answers[key] = value;
			journeyResponse.answers[key] = value;
		});

		return responseToSave;
	}
}

/** @type {(maybeDivider: Option) => maybeDivider is { divider: string }} */
const optionIsDivider = (maybeDivider) => Object.hasOwn(maybeDivider, 'divider');

/** @type {(conditional: unknown) => conditional is { html: string }} */
const conditionalIsJustHTML = (conditional) =>
	!!conditional && Object.hasOwn(conditional, 'html') && Object.keys(conditional).length === 1;

module.exports = { OptionsQuestion, optionIsDivider, conditionalIsJustHTML };
