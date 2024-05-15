const Question = require('../../question');

/**
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 * @typedef {import('../../validator/base-validator')} BaseValidator
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
	 * @param {Object[]} params.inputFields input fields
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

	// TODO - formatAnswerForSummary, getAction, consider Section isComplete...
}

module.exports = MultiFieldInputQuestion;
