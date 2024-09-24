const { questions } = require('../questions');
const { Section } = require('../section');
const config = require('../../config');
const { questionHasAnswer } = require('../dynamic-components/utils/question-has-answer');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('../journey').Journey>[0], 'response'>} JourneyParameters
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
		.withCondition((response) =>
			questionHasAnswer(response, questions.appellantFinalComment, 'yes')
		)
		.addQuestion(questions.uploadAppellantFinalCommentDocuments)
		.withCondition((response) =>
			questionHasAnswer(response, questions.appellantFinalCommentDocuments, 'yes')
		)
];

const baseAppellantFinalCommentUrl = '/appeals/final-comments';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseAppellantFinalCommentUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.S78_APPELLANT_FINAL_COMMENTS,
	journeyTemplate: 'final-comments-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/final-comments',
	journeyTitle: 'Appeal a planning decision',
	sections,
	makeBaseUrl
};

module.exports = { baseAppellantFinalCommentUrl, ...params };
