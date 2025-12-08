const CheckboxQuestion = require('../checkbox/question');

// New extension class to enable method overrides for Grounds of Appeal Radio Questions

class AppealGroundsCheckboxQuestion extends CheckboxQuestion {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Array.<import('../../options-question').Option>} [params.options]
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 *
	 * @param {Record<string, Function>} [methodOverrides]
	 */
	constructor(
		{ title, question, fieldName, url, pageTitle, description, options, validators },
		methodOverrides
	) {
		super(
			{
				title,
				question,
				fieldName,
				url,
				pageTitle,
				description,
				options,
				validators
			},
			methodOverrides
		);
	}
}

module.exports = AppealGroundsCheckboxQuestion;
