const Question = require('../../question');
const { dateInputsToDate } = require('../utils/date-inputs-to-date');
const formatDate = require('../../../lib/format-date-check-your-answers');

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
	 * @param {string} params.hint
	 * @param {Array.<BaseValidator>} [params.validators]
	 */
	constructor({ title, question, fieldName, validators, hint }) {
		super({
			title: title,
			viewFolder: 'date',
			fieldName: fieldName,
			question: question,
			validators: validators,
			hint: hint
		});
	}

	/**
	 * returns the data to send to the DB
	 * side effect: modifies journeyResponse with the new answers
	 * @param {ExpressRequest} req
	 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
	 * @returns {Promise.<Object>}
	 */
	async getDataToSave(req, journeyResponse) {
		// set answer on response
		let responseToSave = { answers: {} };

		const dayInput = req.body[`${this.fieldName}_day`];
		const monthInput = req.body[`${this.fieldName}_month`];
		const yearInput = req.body[`${this.fieldName}_year`];

		const dateToSave = dateInputsToDate(dayInput, monthInput, yearInput);

		responseToSave.answers[this.fieldName] = dateToSave;

		journeyResponse.answers[this.fieldName] = responseToSave.answers[this.fieldName];

		return responseToSave;
	}

	/**
	 * gets the view model for this question
	 * @param {Section} section - the current section
	 * @param {Journey} journey - the journey we are in
	 * @param {Object|undefined} [customViewData] additional data to send to view
	 * @returns {QuestionViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData, payload) {
		let viewModel = super.prepQuestionForRendering(section, journey, customViewData);

		let answer = '';
		let day;
		let month;
		let year;

		if (payload) {
			day = payload[`${this.fieldName}_day`];
			month = payload[`${this.fieldName}_month`];
			year = payload[`${this.fieldName}_year`];
		} else {
			const answerDateString = journey.response.answers[this.fieldName];

			if (answerDateString) {
				const answerDate = new Date(answerDateString);
				day = `${answerDate.getDate()}`.slice(-2);
				month = `${answerDate.getMonth() + 1}`.slice(-2);
				year = `${answerDate.getFullYear()}`;
			}
		}

		answer = {
			[`${this.fieldName}_day`]: day,
			[`${this.fieldName}_month`]: month,
			[`${this.fieldName}_year`]: year
		};

		viewModel.question.value = answer;
		viewModel.answer = answer;

		return viewModel;
	}

	/**
	 * returns the formatted answer value to be used to build task list elements
	 * @param {Object} answer
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {Array.<Object>}
	 */
	formatAnswerForSummary(sectionSegment, journey, answer) {
		let formattedAnswer;

		if (answer) {
			const date = formatDate(new Date(answer));
			formattedAnswer = `${date.date} ${date.month} ${date.year}`;
		} else {
			formattedAnswer = this.NOT_STARTED;
		}

		const action = this.getAction(sectionSegment, journey, answer);
		const key = this.title ?? this.question;

		return [{ key: key, value: formattedAnswer, action: action }];
	}
}

module.exports = DateQuestion;
