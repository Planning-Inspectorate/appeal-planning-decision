const Question = require('../../question');

/**
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 */

/**
 * @typedef {QuestionViewModel & { question: QuestionViewModel['question'] & { label?: string } }} ConfirmationViewModel
 */

/**
 * @class
 */
class ConfirmationQuestion extends Question {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.description]
	 * @param {string} [params.url]
	 * @param {string} [params.html]
	 * @param {string|undefined} [params.label]
	 */
	constructor(params) {
		super({
			...params,
			viewFolder: 'confirmation'
		});

		this.label = params.label;
	}

	/**
	 * gets the view model for this question
	 * @param {Object} options
	 * @param {Section} options.section - the current section
	 * @param {Journey} options.journey - the journey we are in
	 * @param {Record<string, unknown>} [options.customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [options.payload]
	 * @param {string} [options.sessionBackLink]
	 * @returns {ConfirmationViewModel}
	 */
	prepQuestionForRendering({ section, journey, customViewData, payload, sessionBackLink }) {
		/** @type {ConfirmationViewModel} */
		let viewModel = super.prepQuestionForRendering({
			section,
			journey,
			customViewData,
			payload,
			sessionBackLink
		});
		viewModel.question.label = this.label;
		return viewModel;
	}

	/**
	 * returns the data to send to the DB
	 * for confirmation pages will be answer will be true
	 * side effect: modifies journeyResponse with the new answers
	 * @param {import('express').Request} req
	 * @param {import('../../journey-response').JourneyResponse} journeyResponse - current journey response, modified with the new answers
	 * @returns {Promise<{ answers: Record<string, unknown> }>}
	 */
	async getDataToSave(req, journeyResponse) {
		/** @type {{ answers: Record<string, unknown> }} */
		let responseToSave = { answers: {} };

		responseToSave.answers[this.fieldName] = true;

		for (const propName in req.body) {
			if (propName.startsWith(this.fieldName + '_')) {
				responseToSave.answers[propName] = req.body[propName]?.trim();
				journeyResponse.answers[propName] = req.body[propName]?.trim();
			}
		}

		journeyResponse.answers[this.fieldName] = responseToSave.answers[this.fieldName];

		return responseToSave;
	}
}

module.exports = ConfirmationQuestion;
