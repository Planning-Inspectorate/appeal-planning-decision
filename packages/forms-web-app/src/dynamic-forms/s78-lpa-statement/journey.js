const { questions } = require('../questions');
const { Section } = require('../section');
const config = require('../../config');
const { questionHasAnswer } = require('../dynamic-components/utils/question-has-answer');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {ConstructorParameters<typeof import('../journey').Journey>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const sections = [
	new Section('', config.dynamicForms.DEFAULT_SECTION)

		.addQuestion(questions.lpaStatement)
		.addQuestion(questions.additionalDocuments)
		.addQuestion(questions.uploadLpaStatementDocuments)
		.withCondition((response) => questionHasAnswer(response, questions.additionalDocuments, 'yes'))
];

const fixedParams = {
	baseS78StatementUrl: '/manage-appeals/appeal-statement',
	journeyTemplate: 'statement-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/statement',
	journeyTitle: 'Manage your appeals',
	sections
};

/**
 * @param {JourneyResponse} response
 * @returns {JourneyParameters}
 */
const buildJourneyParams = (response) => [
	{
		...fixedParams,
		response,
		baseUrl: `${fixedParams.baseS78StatementUrl}/${encodeURIComponent(response.referenceId)}`
	}
];

module.exports = { buildJourneyParams, ...fixedParams };
