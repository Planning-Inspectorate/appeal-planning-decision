const nunjucks = require('nunjucks');
const Question = require('./question');

const ValidOptionValidator = require('./validator/valid-option-validator');
const { getConditionalFieldName } = require('./dynamic-components/utils/question-utils');

/**
 * @typedef {import('./question').QuestionViewModel} QuestionViewModel
 * @typedef {import('./journey').Journey} Journey
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('./section').Section} Section
 */

/**
 * @typedef {{
 *   text: string;
 *   value: string;
 *   checked?: boolean | undefined;
 *   attributes?: Record<string, string>;
 *   conditional?: {
 *     question: string;
 *     type: string;
 *     fieldName: string;
 * 		 inputClasses?: string;
 * 		 html?: string;
 *     value?: unknown;
 *   };
 *}} Option
 */

/**
 * @typedef {QuestionViewModel & { question: { options: Option[] } }} OptionsViewModel
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
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Array<Option>} params.options
	 * @param {Array<import('./question').BaseValidator>} [params.validators]
	 */
	constructor({
		title,
		question,
		viewFolder,
		fieldName,
		url,
		pageTitle,
		description,
		options,
		validators
	}) {
		// add default valid options validator to all options questions
		let optionsValidators = [new ValidOptionValidator()];
		if (validators && Array.isArray(validators)) {
			optionsValidators = validators.concat(optionsValidators);
		}

		super({
			title,
			question,
			viewFolder,
			fieldName,
			url,
			pageTitle,
			description,
			validators: optionsValidators
		});

		this.options = options;
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

				conditionalField.fieldName = getConditionalFieldName(
					this.fieldName,
					conditionalField.fieldName
				);
				conditionalField.value = payload
					? payload[conditionalField.fieldName]
					: journey.response.answers[conditionalField.fieldName] || '';

				optionData.conditional = {
					...optionData.conditional,
					html: nunjucks.render(`./dynamic-components/conditional/${conditionalField.type}.njk`, {
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

		const fieldValues = Array.isArray(req.body[this.fieldName])
			? req.body[this.fieldName]
			: [req.body[this.fieldName]];

		const selectedOptions = this.options.filter(({ value }) => {
			return fieldValues.includes(value);
		});

		if (!selectedOptions.length)
			throw new Error(
				`User submitted option(s) did not correlate with valid answers to ${this.fieldName} question`
			);

		responseToSave.answers[this.fieldName] = fieldValues.join(',');
		journeyResponse.answers[this.fieldName] = fieldValues;

		// sort conditional subsections they should be able to answer form those they shouldn't
		const [validConditionalFieldNames, invalidConditionalFieldNames] = this.options.reduce(
			(/** @type {[string[], string[]]} */ acc, option) => {
				if (!option.conditional) return acc;
				const optionIsSelectedOption = selectedOptions.some(
					(selectedOption) =>
						option.text === selectedOption.text && option.value === selectedOption.value
				);
				if (!optionIsSelectedOption) return [acc[0], [...acc[1], option.conditional.fieldName]];
				return [[...acc[0], option.conditional.fieldName], acc[1]];
			},
			[[], []]
		);

		// add data from each valid conditional answer to data to be saved
		validConditionalFieldNames.forEach((validConditionalFieldName) => {
			const key = getConditionalFieldName(this.fieldName, validConditionalFieldName);
			const conditionalAnswer = req.body[key];
			if (!conditionalAnswer) return;
			responseToSave.answers[key] = req.body[key];
			journeyResponse.answers[key] = req.body[key];
		});

		// nullify data in each conditional answer where data might have been before
		invalidConditionalFieldNames.forEach((invalidConditionalFieldName) => {
			const key = getConditionalFieldName(this.fieldName, invalidConditionalFieldName);
			responseToSave.answers[key] = null;
			journeyResponse.answers[key] = null;
		});

		console.log('🚀 ~ OptionsQuestion ~ getDataToSave ~ responseToSave:', responseToSave);

		return responseToSave;
	}
}

module.exports = OptionsQuestion;
