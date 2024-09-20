const { questions } = require('../questions');
const { Section } = require('../section');
const config = require('../../config');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
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
		.addQuestion(questions.lpaFinalComment)
		.addQuestion(questions.lpaFinalCommentDetails)
		.withCondition((response) => questionHasAnswer(response, questions.lpaFinalComment, 'yes'))
		.addQuestion(questions.lpaFinalCommentDocuments)
		.addQuestion(questions.uploadLPAFinalCommentDocuments)
		.withCondition((response) =>
			questionHasAnswer(response, questions.lpaFinalCommentDocuments, 'yes')
		)
];

const baseS78LPAFinalCommentsUrl = '/manage-appeals/final-comments';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseS78LPAFinalCommentsUrl}/${encodeURIComponent(response.referenceId)}`;

const params = {
	journeyId: JOURNEY_TYPES.S78_LPA_FINAL_COMMENTS,
	journeyTemplate: 'final-comments-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/final-comments',
	journeyTitle: 'Manage your appeals',
	sections,
	makeBaseUrl
};

module.exports = { baseS78LPAFinalCommentsUrl, ...params };
