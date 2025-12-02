const Question = require('../../question');

/** @typedef {import('../../journey-response').JourneyResponse} JourneyResponse */

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
	 * @param {string} [params.html]
	 * @param {Array.<import('../../validator/base-validator')>} [params.validators]
	 *
	 * @param {JourneyResponse} [response]
	 */
	constructor({ title, question, fieldName, hint, validators, viewFolder, html }, response) {
		super(
			{
				title,
				viewFolder,
				fieldName,
				question,
				validators,
				hint,
				html
			},
			response
		);
	}
}

module.exports = AddMoreQuestion;
