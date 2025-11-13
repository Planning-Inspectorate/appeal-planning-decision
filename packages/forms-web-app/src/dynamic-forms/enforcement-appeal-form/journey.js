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
const { fieldValues } = require('@pins/common/src/dynamic-forms/field-values');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('@pins/dynamic-forms/src/journey').Journey>[0], 'response'>} JourneyParameters
 */

const escape = require('escape-html');
/**
 * @param {JourneyResponse} response
 * @returns {string}
 */

const formatEnforcementIndividualName = (response) => {
	const firstName = response.answers['appellantFirstName'] || 'Named';
	const lastName = response.answers['appellantLastName'] || 'Individual';

	return escape(`${firstName} ${lastName}`);
};

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const makeSections = (response) => [
	new Section('Prepare appeal', 'prepare-appeal')
		.addQuestion(questions.enforcementWhoIsAppealing)
		.addQuestion(questions.enforcementIndividualName)
		.withCondition(() =>
			questionHasAnswer(
				response,
				questions.enforcementWhoIsAppealing,
				fieldValues.enforcementWhoIsAppealing.INDIVIDUAL
			)
		)
		.addQuestion(questions.enforcementAreYouIndividual)
		.withCondition(() =>
			questionHasAnswer(
				response,
				questions.enforcementWhoIsAppealing,
				fieldValues.enforcementWhoIsAppealing.INDIVIDUAL
			)
		)
		.withVariables({
			[QUESTION_VARIABLES.INDIVIDUAL_NAME]: formatEnforcementIndividualName(response)
		})
		.addQuestion(questions.enforcementOrganisationName)
		.withCondition(() =>
			questionHasAnswer(
				response,
				questions.enforcementWhoIsAppealing,
				fieldValues.enforcementWhoIsAppealing.ORGANISATION
			)
		)
		.addQuestion(questions.contactDetails)
		.addQuestion(questions.contactPhoneNumber)
		// consider whether to make dynamic to generate hint...
		.addQuestion(questions.appealSiteAddress)
		.addQuestion(questions.appealSiteIsContactAddress)
		.addQuestion(questions.contactAddress)
		.withCondition(() => questionHasAnswer(response, questions.appealSiteIsContactAddress, 'no'))
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
