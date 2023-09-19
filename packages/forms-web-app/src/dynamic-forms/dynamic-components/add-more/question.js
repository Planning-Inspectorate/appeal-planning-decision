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
	 * @param {Question} params.subQuestion
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor({
		title,
		question,
		fieldName,
		subQuestion,
		url,
		pageTitle,
		description,
		validators
	}) {
		super({
			title,
			question,
			viewFolder: 'unused',
			fieldName,
			url,
			pageTitle,
			description,
			validators
		});

		if (!subQuestion || !(subQuestion instanceof Question)) {
			throw new Error('subQuestion parameter is mandatory');
		}

		this.subQuestion = subQuestion;
	}

	/**
	 * adds a uuid to the data to save
	 */
	async getDataToSave(req, journeyResponse) {
		const individual = await this.subQuestion.getDataToSave(req, journeyResponse);
		individual.answers.addMoreId = uuid.v4();
		return individual.answers;
	}
}

module.exports = AddMoreQuestion;
