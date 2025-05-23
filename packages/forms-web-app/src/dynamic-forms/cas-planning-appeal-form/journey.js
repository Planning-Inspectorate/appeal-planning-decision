const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('../section');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const config = require('../../config');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('../journey').Journey>[0], 'response'>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const sections = [
	new Section('Prepare appeal', 'prepare-appeal').addQuestion(questions.applicationName)
];

const baseCASPlanningSubmissionUrl = '/appeals/cas-planning';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) => `${baseCASPlanningSubmissionUrl}?id=${response.referenceId}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.CAS_PLANNING_APPEAL_FORM,
	sections,
	taskListUrl: 'appeal-form/your-appeal',
	journeyTemplate: 'submission-form-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/submission',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Appeal a planning decision',
	returnToListing: true,
	makeBaseUrl,
	bannerHtmlOverride:
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('CAS_PLANNING'))
};

module.exports = {
	...params,
	baseCASPlanningSubmissionUrl
};
