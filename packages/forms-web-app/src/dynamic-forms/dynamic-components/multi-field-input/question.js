const Question = require('../../question');

/**
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 * @typedef {import('../../validator/base-validator')} BaseValidator
 */

/**
 * @typedef {Object} InputField
 * @property {string} fieldName
 * @property {string} label
 */

/**
 * @class
 */
class MultiFieldInputQuestion extends Question {
	/** @type {Record<string, string>} */
	inputAttributes;

	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.description]
	 * @param {string} [params.url]
	 * @param {string} [params.html]
	 * @param {string} [params.hint]
	 * @param {string|undefined} [params.label] if defined this show as a label for the input and the question will just be a standard h1
	 * @param {Array.<BaseValidator>} [params.validators]
	 * @param {Record<string, string>} [params.inputAttributes] html attributes to add to the input
	 * @param {InputField[]} params.inputFields input fields
	 * @param {'contactDetails' | 'standard' | null} [params.formatType] optional type field used for formatting for task list
	 */
	constructor({
		title,
		question,
		fieldName,
		url,
		hint,
		validators,
		html,
		label,
		inputAttributes = {},
		inputFields,
		formatType
	}) {
		super({
			title,
			viewFolder: 'multi-field-input',
			fieldName,
			url,
			question,
			validators,
			hint,
			html
		});
		this.label = label;
		this.inputAttributes = inputAttributes;
		this.formatType = formatType || 'standard';

		if (inputFields) {
			this.inputFields = inputFields;
		} else {
			throw new Error('inputFields are mandatory');
		}
	}

	prepQuestionForRendering(section, journey, customViewData, payload) {
		let viewModel = super.prepQuestionForRendering(section, journey, customViewData);

		const inputFields = this.inputFields.map((inputField) => {
			return payload
				? { ...inputField, value: payload[inputField.fieldName] }
				: { ...inputField, value: journey.response.answers[inputField.fieldName] };
		});

		viewModel.question.inputFields = inputFields;
		viewModel.question.label = this.label;
		viewModel.question.attributes = this.inputAttributes;
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

		for (const inputField of this.inputFields) {
			responseToSave.answers[inputField.fieldName] = req.body[inputField.fieldName];
			journeyResponse.answers[inputField.fieldName] = responseToSave.answers[inputField.fieldName];
		}

		return responseToSave;
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
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
	formatAnswerForSummary(sectionSegment, journey) {
		const summaryDetails =
			this.formatType === 'contactDetails'
				? this.formatContactDetails(journey, this.inputFields)
				: this.inputFields.reduce((acc, field) => {
						const answer = journey.response.answers[field.fieldName];
						return answer ? acc + (acc ? ' ' : '') + answer : acc;
				  }, '');

		return [
			{
				key: `${this.title}`,
				value: this.format(summaryDetails),
				action: this.getAction(sectionSegment, journey, summaryDetails)
			}
		];
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {Journey} journey
	 * @param {InputField[]} inputFields
	 * @returns {String}
	 */
	formatContactDetails(journey, inputFields) {
		const firstNameField =
			inputFields.find((inputField) => inputField.fieldName.includes('FirstName'))?.fieldName || '';
		const lastNameField =
			inputFields.find((inputField) => inputField.fieldName.includes('LastName'))?.fieldName || '';
		const companyNameField =
			inputFields.find((inputField) => inputField.fieldName.includes('CompanyName'))?.fieldName ||
			'';

		if (!journey.response.answers[firstNameField]) return this.NOT_STARTED;

		const contactName = `${journey.response.answers[firstNameField]} ${journey.response.answers[lastNameField]}`;
		const companyName = journey.response.answers[companyNameField];

		return contactName + (companyName ? `<br>${companyName}` : '');
	}

	/**
	 * Returns the action link for the question
	 * @param {Object} answer
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {{ href: string; text: string; visuallyHiddenText: string; }}
	 */
	getAction(sectionSegment, journey, answer) {
		const action = {
			href: journey.getCurrentQuestionUrl(sectionSegment, this.fieldName),
			text: !answer || answer === this.NOT_STARTED ? 'Answer' : 'Change',
			visuallyHiddenText: this.question
		};
		return action;
	}
}

module.exports = MultiFieldInputQuestion;
