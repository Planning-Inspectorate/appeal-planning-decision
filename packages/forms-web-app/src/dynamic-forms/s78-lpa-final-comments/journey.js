const { getQuestions } = require('../questions');

const { Section } = require('@pins/dynamic-forms/src/section');
const config = require('../../config');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const {
	questionHasAnswer
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD }
	}
} = require('#lib/views');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {ConstructorParameters<typeof import('@pins/dynamic-forms/src/journey').Journey>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const makeSections = (response) => {
	const questions = getQuestions(response);
	return [
		new Section('', config.dynamicForms.DEFAULT_SECTION)
			.addQuestion(questions.lpaContinue)
			.addQuestion(questions.lpaFinalComment)
			.addQuestion(questions.lpaFinalCommentDetails)
			.withCondition(() => questionHasAnswer(response, questions.lpaFinalComment, 'yes'))
			.addQuestion(questions.lpaFinalCommentDocuments)
			.withCondition(() => questionHasAnswer(response, questions.lpaFinalComment, 'yes'))
			.addQuestion(questions.uploadLPAFinalCommentDocuments)
			.withCondition(() => questionHasAnswer(response, questions.lpaFinalCommentDocuments, 'yes'))
	];
};

const baseS78LPAFinalCommentsUrl = '/manage-appeals/final-comments';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseS78LPAFinalCommentsUrl}/${encodeURIComponent(response.referenceId)}`;

const params = {
	initialBackLink: `/${DASHBOARD}`,
	journeyId: JOURNEY_TYPES.LPA_FINAL_COMMENTS.id,
	journeyTemplate: 'statement-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/final-comments',
	journeyTitle: 'Manage your appeals',
	makeSections,
	makeBaseUrl
};

module.exports = { baseS78LPAFinalCommentsUrl, ...params };
