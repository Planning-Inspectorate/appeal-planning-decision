const Question = require('../../question');
const { parseDateInput, formatDateForDisplay } = require('@pins/common/src/lib/format-date');

/**
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 */

/**
 * @class
 */
class DateQuestion extends Question {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.hint]
	 * @param {string} [params.url]
	 * @param {Array.<import('../../validator/base-validator')>} [params.validators]
	 */
	constructor({ title, question, fieldName, validators, hint, url }) {
		super({
			title,
			viewFolder: 'date',
			fieldName,
			question,
			validators,
			hint,
			url
		});
	}

	/**
	 * returns the data to send to the DB
	 * side effect: modifies journeyResponse with the new answers
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
	 * @returns {Promise<{ answers: Record<string, unknown> }>}
	 */
	async getDataToSave(req, journeyResponse) {
		// set answer on response
		/** @type {{ answers: Record<string, unknown> }} */
		let responseToSave = { answers: {} };

		const dayInput = req.body[`${this.fieldName}_day`];
		const monthInput = req.body[`${this.fieldName}_month`];
		const yearInput = req.body[`${this.fieldName}_year`];

		const dateToSave = parseDateInput({ day: dayInput, month: monthInput, year: yearInput });

		responseToSave.answers[this.fieldName] = dateToSave;

		journeyResponse.answers[this.fieldName] = responseToSave.answers[this.fieldName];

		return responseToSave;
	}

	/**
	 * gets the view model for this question
	 * @param {Section} section - the current section
	 * @param {Journey} journey - the journey we are in
	 * @param {Record<string, unknown>} [customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [payload]
	 * @returns {QuestionViewModel & { answer: Record<string, unknown> }}
	 */
	prepQuestionForRendering(section, journey, customViewData, payload) {
		const viewModel = super.prepQuestionForRendering(section, journey, customViewData);

		/** @type {Record<string, unknown>} */
		let answer = {};
		let day;
		let month;
		let year;

		if (payload) {
			day = payload[`${this.fieldName}_day`];
			month = payload[`${this.fieldName}_month`];
			year = payload[`${this.fieldName}_year`];
		} else {
			const answerDateString = journey.response.answers[this.fieldName];

			if (
				answerDateString &&
				(typeof answerDateString === 'string' || answerDateString instanceof Date)
			) {
				const answerDate = new Date(answerDateString);
				day = formatDateForDisplay(answerDate, { format: 'd' });
				month = formatDateForDisplay(answerDate, { format: 'M' });
				year = formatDateForDisplay(answerDate, { format: 'yyyy' });
			}
		}

		answer = {
			[`${this.fieldName}_day`]: day,
			[`${this.fieldName}_month`]: month,
			[`${this.fieldName}_year`]: year
		};

		return { ...viewModel, answer, question: { ...viewModel.question, value: answer } };
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @type {Question['formatAnswerForSummary']}
	 */
	formatAnswerForSummary(sectionSegment, journey, answer) {
		let formattedAnswer;

		if (answer) {
			formattedAnswer = formatDateForDisplay(answer, { format: 'd MMMM yyyy' });
		} else {
			formattedAnswer = this.NOT_STARTED;
		}

		const action = this.getAction(sectionSegment, journey, answer);
		const key = this.title ?? this.question;

		return [{ key: key, value: formattedAnswer, action: action }];
	}
}

module.exports = DateQuestion;
