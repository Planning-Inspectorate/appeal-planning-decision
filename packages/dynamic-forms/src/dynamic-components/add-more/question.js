const Question = require('../../questions/question');

/**
 * @class
 */
class AddMoreQuestion extends Question {
	/**
	 * @param {import('#question-types').QuestionParameters} params
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
