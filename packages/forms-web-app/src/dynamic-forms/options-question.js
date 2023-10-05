const nunjucks = require('nunjucks');
const Question = require('./question');

const ValidOptionValidator = require('./validator/valid-option-validator');

/**
 * @typedef {import('./question').QuestionViewModel} QuestionViewModel
 * @typedef {import('./journey').Journey} Journey
 * @typedef {import('./section').Section} Section
 */

/**
 * @typedef {Object} Option
 * @property {string} text - text shown to user
 * @property {string} value - value on form
 * @property {boolean|undefined} [checked] - if the
 * @property {Object|undefined} [conditional]
 */

/**
 * @typedef {QuestionViewModel & { question: OptionsProperty }} OptionsViewModel
 */

/**
 * @typedef {Object} OptionsProperty
 * @property {Array.<Option> | Array} options - An array of options.
 */

class OptionsQuestion extends Question {
	/** @type {Array.<Option>} */
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
	 * @param {Array.<Option>} params.options
	 * @param {Array.<import('./question').BaseValidator>} [params.validators]
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
	 * @param {Object|undefined} [customViewData] additional data to send to view
	 * @returns {OptionsViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData) {
		const answer = journey.response.answers[this.fieldName] || '';

		const viewModel = super.prepQuestionForRendering(section, journey, customViewData);

		viewModel.question.options = [];

		for (const option of this.options) {
			let optionData = { ...option };
			if (optionData.value !== undefined) {
				optionData.checked = (',' + answer + ',').includes(',' + optionData.value + ',');
			}

			// handle conditional (dependant) fields & set their answers
			if (optionData.conditional !== undefined) {
				let conditionalField = { ...optionData.conditional };

				conditionalField.fieldName = this.fieldName + '_' + conditionalField.fieldName;
				conditionalField.value = journey.response.answers[conditionalField.fieldName] || '';

				optionData.conditional = {
					html: nunjucks.render(
						`./dynamic-components/conditional/${conditionalField.type}.njk`,
						conditionalField
					)
				};
			}

			viewModel.question.options.push(optionData);
		}

		return viewModel;
	}
}

module.exports = OptionsQuestion;
