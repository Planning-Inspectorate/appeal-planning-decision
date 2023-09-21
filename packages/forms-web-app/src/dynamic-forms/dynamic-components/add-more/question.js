const Question = require('../../question');
const uuid = require('uuid');

/**
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 */

/**
 * @class
 */
class AddMoreQuestion extends Question {
	/**
	 * @param {Object} params
	 * @param {Question} params.subQuestion
	 */
	constructor({ subQuestion }) {
		super({
			title: subQuestion.title,
			viewFolder: subQuestion.viewFolder,
			fieldName: subQuestion.fieldName,
			question: subQuestion.question
		});

		this.subQuestion = subQuestion;
	}

	/**
	 * adds a uuid to the data to save
	 * @param {ExpressRequest} req
	 * @param {JourneyResponse} journeyResponse
	 * @returns
	 */
	async getDataToSave(req, journeyResponse) {
		// this has side effects on journeyResponse
		const individual = await this.subQuestion.getDataToSave(req, journeyResponse);
		individual.answers.addMoreId = uuid.v4();
		return individual.answers;
	}

	/**
	 * renders the subquestion
	 * @param {ExpressResponse} res - the express response
	 * @param {QuestionViewModel} viewModel additional data to send to view
	 * @returns {void}
	 */
	renderAction(res, viewModel) {
		return this.subQuestion.renderAction(res, viewModel);
	}

	/**
	 * gets the view model for the subquestion
	 * @param {Section} section - the current section
	 * @param {Journey} journey - the journey we are in
	 * @param {Object|undefined} [customViewData] additional data to send to view
	 * @returns {QuestionViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData) {
		return this.subQuestion.prepQuestionForRendering(section, journey, customViewData);
	}

	/**
	 * returns answer to the subquestion question formatted for a list view
	 * @param {Object} answer
	 * @returns {string}
	 */
	formatAnswerForSummary(answer) {
		return this.subQuestion.formatAnswerForSummary(answer[this.subQuestion.fieldName]);
	}
}

module.exports = AddMoreQuestion;
