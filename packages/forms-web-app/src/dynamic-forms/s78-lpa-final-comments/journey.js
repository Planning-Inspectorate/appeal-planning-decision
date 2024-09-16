// const { questions } = require('../questions');
const { Section } = require('../section');
const config = require('../../config');
// const { questionHasAnswer } = require('../dynamic-components/utils/question-has-answer');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {ConstructorParameters<typeof import('../journey').Journey>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const sections = [new Section('', config.dynamicForms.DEFAULT_SECTION)];

const fixedParams = {
	baseS78LPAFinalCommentsUrl: '/manage-appeals/final-comments',
	journeyTemplate: 'final-comments-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/final-comments',
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
		baseUrl: `${fixedParams.baseS78LPAFinalCommentsUrl}/${encodeURIComponent(response.referenceId)}`
	}
];

module.exports = { buildJourneyParams, ...fixedParams };
