const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('@pins/dynamic-forms/src/section');
const {
	questionHasAnswer
	// questionsHaveAnswers,
	// questionHasNonEmptyStringAnswer,
	// questionHasNonEmptyNumberAnswer
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
// const { APPEAL_CASE_PROCEDURE } = require('@planning-inspectorate/data-model');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const {
	CASE_TYPES: { ENFORCEMENT }
} = require('@pins/common/src/database/data-static');
const config = require('../../config');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('@pins/dynamic-forms/src/journey').Journey>[0], 'response'>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const makeSections = (response) => [
	new Section('Prepare appeal', 'prepare-appeal')
		.addQuestion(questions.applicationName)
		.addQuestion(questions.applicantName)
		.withCondition(() => questionHasAnswer(response, questions.applicationName, 'no'))
];

const baseEnforcementSubmissionUrl = `/appeals/${ENFORCEMENT.friendlyUrl}`;

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) => `${baseEnforcementSubmissionUrl}?id=${response.referenceId}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.ENFORCEMENT_APPEAL_FORM.id,
	makeSections,
	taskListUrl: 'appeal-form/your-appeal',
	journeyTemplate: 'submission-form-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/submission',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Appeal a planning decision',
	returnToListing: true,
	makeBaseUrl,
	bannerHtmlOverride:
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(ENFORCEMENT.processCode))
};

module.exports = { ...params, baseEnforcementSubmissionUrl };
