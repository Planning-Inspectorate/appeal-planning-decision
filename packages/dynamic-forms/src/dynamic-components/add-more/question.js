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
	constructor(params) {
		super(params);
	}
}

module.exports = AddMoreQuestion;
