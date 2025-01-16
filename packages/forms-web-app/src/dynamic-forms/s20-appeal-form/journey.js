const { questions } = require('../questions');
const { Section } = require('../section');
// const {
// 	questionHasAnswer,
// 	questionsHaveAnswers
// } = require('../dynamic-components/utils/question-has-answer');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('../journey').Journey>[0], 'response'>} JourneyParameters
` */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const sections = [
	new Section('Prepare appeal', 'prepare-appeal').addQuestion(questions.applicationName)
];

const baseS20SubmissionUrl = '/appeals/listed-building';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) => `${baseS20SubmissionUrl}?id=${response.referenceId}`;

const params = {
	journeyId: JOURNEY_TYPES.S20_APPEAL_FORM,
	sections,
	taskListUrl: 'appeal-form/your-appeal',
	journeyTemplate: 'submission-form-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/submission',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Appeal a planning decision',
	returnToListing: true,
	makeBaseUrl
};

module.exports = {
	...params,
	baseS20SubmissionUrl
};
