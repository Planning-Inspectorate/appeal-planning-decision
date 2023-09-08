const RadioQuestion = require('../radio/question');

class BooleanTextQuestion extends RadioQuestion {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor({ title, question, fieldName, url, pageTitle, description, validators }) {
		const options = [
			{
				text: 'Yes',
				value: 'yes'
			},
			{
				text: 'No',
				value: 'no'
			}
		];

		super({
			title,
			question,
			viewFolder: 'boolean-text',
			fieldName,
			url,
			pageTitle,
			description,
			options,
			validators
		});
	}
}

module.exports = BooleanTextQuestion;
