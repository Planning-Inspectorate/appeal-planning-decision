const Question = require('../../question');
const escape = require('escape-html');
const { nl2br } = require('@pins/common/src/utils');

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
 * @property {string} [formatJoinString] optional property, used by formatAnswerForSummary (eg task list display), effective default to line break
 * @property {Record<string, string>} [attributes] optional property, used to add html attributes to the field
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
	 * @param {InputField[]} [params.inputFields] input fields
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
		inputFields
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

		if (inputFields) {
			this.inputFields = inputFields;
		} else {
			throw new Error('inputFields are mandatory');
		}
	}

	/**
	 * gets the view model for this question
	 * @param {Object} options - the current section
	 * @param {Section} options.section - the current section
	 * @param {Journey} options.journey - the journey we are in
	 * @param {string} [options.sessionBackLink]
	 * @param {Record<string, unknown>} [options.customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [options.payload]
	 * @returns {QuestionViewModel & {
	 *   question: QuestionViewModel['question'] & {
	 *     inputFields: Array<InputField & { value: string | unknown }>;
	 * 		 label?: string;
	 *     attributes?: Record<string, string>;
	 *   }
	 * }}
	 */
	prepQuestionForRendering({ section, journey, customViewData, payload, sessionBackLink }) {
		const viewModel = super.prepQuestionForRendering({
			section,
			journey,
			customViewData,
			sessionBackLink
		});

		const inputFields = this.inputFields.map((inputField) => {
			return payload
				? { ...inputField, value: payload[inputField.fieldName] }
				: { ...inputField, value: journey.response.answers[inputField.fieldName] };
		});

		return {
			...viewModel,
			question: {
				...viewModel.question,
				inputFields,
				label: this.label,
				attributes: this.inputAttributes
			}
		};
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
			responseToSave.answers[inputField.fieldName] = req.body[inputField.fieldName]?.trim();
			journeyResponse.answers[inputField.fieldName] = responseToSave.answers[inputField.fieldName];
		}

		return responseToSave;
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @type {Question['formatAnswerForSummary']}
	 */
	formatAnswerForSummary(sectionSegment, journey) {
		const summaryDetails = this.inputFields.reduce((acc, field) => {
			const answer = journey.response.answers[field.fieldName];
			return answer ? acc + answer + (field.formatJoinString || '\n') : acc;
		}, '');

		const formattedAnswer = summaryDetails || this.NOT_STARTED;

		return [
			{
				key: `${this.title}`,
				value: nl2br(escape(formattedAnswer)),
				action: this.getAction(sectionSegment, journey, summaryDetails)
			}
		];
	}
}

module.exports = MultiFieldInputQuestion;
