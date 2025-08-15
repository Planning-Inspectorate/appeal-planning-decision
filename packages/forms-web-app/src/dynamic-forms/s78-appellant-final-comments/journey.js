const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('../section');
const config = require('../../config');
const { questionHasAnswer } = require('../dynamic-components/utils/question-has-answer');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const {
	VIEW: {
		APPEALS: { YOUR_APPEALS }
	}
} = require('#lib/views');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('../journey').Journey>[0], 'response'>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const makeSections = (response) => [
	new Section('', config.dynamicForms.DEFAULT_SECTION)
		.addQuestion(questions.appellantFinalComment)
		.addQuestion(questions.appellantFinalCommentDetails)
		.withCondition(() => questionHasAnswer(response, questions.appellantFinalComment, 'yes'))
		.addQuestion(questions.appellantFinalCommentDocuments)
		.withCondition(() => questionHasAnswer(response, questions.appellantFinalComment, 'yes'))
		.addQuestion(questions.uploadAppellantFinalCommentDocuments)
		.withCondition(() =>
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
	initialBackLink: `/${YOUR_APPEALS}`,
	journeyId: JOURNEY_TYPES.APPELLANT_FINAL_COMMENTS.id,
	journeyTemplate: 'final-comments-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/final-comments',
	journeyTitle: 'Appeal a planning decision',
	makeSections,
	makeBaseUrl,
	bannerHtmlOverride:
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('S78'))
};

module.exports = { baseAppellantFinalCommentUrl, ...params };
