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
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor({ title, question, fieldName, viewFolder, url, pageTitle, description, validators }) {
		super({
			title,
			question,
			viewFolder, // should we have a subquestion or a view folder
			fieldName,
			url,
			pageTitle,
			description,
			validators
		});
	}

	/**
	 * adds a uuid to the data to save
	 */
	async getDataToSave(req, journeyResponse) {
		// this has side effects on journeyResponse
		const individual = await super.getDataToSave(req, journeyResponse);
		individual.answers.addMoreId = uuid.v4();
		return individual.answers;
	}
}

module.exports = AddMoreQuestion;
