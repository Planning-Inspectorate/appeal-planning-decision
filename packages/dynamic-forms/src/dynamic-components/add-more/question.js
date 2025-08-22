const Question = require('../../question');

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
	 */
	constructor({ title, question, fieldName, hint, validators, viewFolder, html }) {
		super({
			title,
			viewFolder,
			fieldName,
			question,
			validators,
			hint,
			html
		});
	}
}

module.exports = AddMoreQuestion;
