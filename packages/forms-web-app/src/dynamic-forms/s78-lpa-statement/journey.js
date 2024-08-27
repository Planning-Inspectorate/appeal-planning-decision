const { questions } = require('../questions');
const { Section } = require('../section');
const config = require('../../config');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {ConstructorParameters<typeof import('../journey').Journey>} JourneyParameters
 */

const fixedParams = {
	baseS78StatementUrl: '/manage-appeals/appeal-statement',
	journeyTemplate: 'statement-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/statement',
	journeyTitle: 'Manage your appeals'
};

/**
 * @param {JourneyResponse} _response
 * @returns {Section[]}
 */
const buildSections = (_response) => {
	return [new Section('', config.dynamicForms.DEFAULT_SECTION).addQuestion(questions.lpaStatement)];
};

/**
 * @param {JourneyResponse} response
 * @returns {JourneyParameters}
 */
const buildJourneyParams = (response) => [
	{
		...fixedParams,
		response,
		baseUrl: `${fixedParams.baseS78StatementUrl}/${encodeURIComponent(response.referenceId)}`,
		sections: buildSections(response)
	}
];

module.exports = { buildJourneyParams, ...fixedParams };
