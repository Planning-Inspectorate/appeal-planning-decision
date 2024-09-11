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
		.addQuestion(questions.appellantFinalComment)
		.addQuestion(questions.appellantFinalCommentDetails)
		.withCondition((response) =>
			questionHasAnswer(response, questions.appellantFinalComment, 'yes')
		)
		.addQuestion(questions.appellantFinalCommentDocuments)
		.addQuestion(questions.uploadAppellantFinalCommentDocuments)
		.withCondition((response) =>
			questionHasAnswer(response, questions.appellantFinalCommentDocuments, 'yes')
		)
];

const fixedParams = {
	baseAppellantFinalCommentUrl: '/appeals/final-comments',
	journeyTemplate: 'final-comments-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/final-comments',
	journeyTitle: 'Appeal a planning decision',
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
		baseUrl: `${fixedParams.baseAppellantFinalCommentUrl}/${encodeURIComponent(
			response.referenceId
		)}`
	}
];

module.exports = { buildJourneyParams, ...fixedParams };
