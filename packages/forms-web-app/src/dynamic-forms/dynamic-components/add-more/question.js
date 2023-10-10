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
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} params.viewFolder
	 * @param {string} [params.hint]
	 * @param {Array.<BaseValidator>} [params.validators]
	 */
	constructor({ title, question, fieldName, hint, validators, viewFolder }) {
		super({
			title: title,
			viewFolder: viewFolder,
			fieldName: fieldName,
			question: question,
			validators: validators,
			hint: hint
		});
	}

	/**
	 * adds a uuid to the data to save
	 * @param {ExpressRequest} req
	 * @returns
	 */
	async getDataToSave(req) {
		return { addMoreId: uuid.v4(), value: req.body[this.fieldName] };
	}
}

module.exports = AddMoreQuestion;
