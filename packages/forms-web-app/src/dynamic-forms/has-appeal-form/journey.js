const { questions } = require('../questions');
const { Section } = require('../section');
const {
	questionHasAnswer,
	questionsHaveAnswers
} = require('../dynamic-components/utils/question-has-answer');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('../journey').Journey>[0], 'response'>} JourneyParameters
` */

/**
 * @param {JourneyResponse} response
 * @returns {boolean}
 */
const shouldDisplayIdentifyingLandowners = (response) => {
	if (questionHasAnswer(response, questions.ownsAllLand, 'yes')) return false;
	if (
		questionHasAnswer(response, questions.ownsSomeLand, 'yes') &&
		questionHasAnswer(response, questions.knowsWhoOwnsRestOfLand, 'yes')
	)
		return false;
	if (
		questionHasAnswer(response, questions.ownsSomeLand, 'no') &&
		questionHasAnswer(response, questions.knowsWhoOwnsLandInvolved, 'yes')
	)
		return false;

	return true;
};

/**
 * @param {JourneyResponse} response
 * @returns {boolean}
 */
const shouldDisplayTellingLandowners = (response) => {
	if (questionHasAnswer(response, questions.ownsAllLand, 'yes')) return false;

	if (
		questionsHaveAnswers(
			response,
			[
				[questions.ownsSomeLand, 'yes'],
				[questions.knowsWhoOwnsRestOfLand, 'no']
			],
			{ logicalCombinator: 'and' }
		) ||
		questionsHaveAnswers(
			response,
			[
				[questions.ownsSomeLand, 'no'],
				[questions.knowsWhoOwnsLandInvolved, 'no']
			],
			{ logicalCombinator: 'and' }
		)
	)
		return false;

	return true;
};

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const sections = [
	new Section('Prepare appeal', 'prepare-appeal')
		.addQuestion(questions.applicationName)
		.addQuestion(questions.applicantName)
		.withCondition((response) => questionHasAnswer(response, questions.applicationName, 'no'))
		.addQuestion(questions.contactDetails)
		.addQuestion(questions.contactPhoneNumber)
		.addQuestion(questions.appealSiteAddress)
		.addQuestion(questions.siteArea)
		.addQuestion(questions.appellantGreenBelt)
		.addQuestion(questions.ownsAllLand)
		.addQuestion(questions.ownsSomeLand)
		.withCondition((response) => questionHasAnswer(response, questions.ownsAllLand, 'no'))
		.addQuestion(questions.knowsWhoOwnsRestOfLand)
		.withCondition((response) =>
			questionsHaveAnswers(
				response,
				[
					[questions.ownsSomeLand, 'yes'],
					[questions.ownsAllLand, 'no']
				],
				{ logicalCombinator: 'and' }
			)
		)
		.addQuestion(questions.knowsWhoOwnsLandInvolved)
		.withCondition((response) =>
			questionsHaveAnswers(
				response,
				[
					[questions.ownsSomeLand, 'no'],
					[questions.ownsAllLand, 'no']
				],
				{ logicalCombinator: 'and' }
			)
		)
		.addQuestion(questions.identifyingLandowners)
		.withCondition(shouldDisplayIdentifyingLandowners)
		.addQuestion(questions.advertisingAppeal)
		.withCondition(
			(response) =>
				shouldDisplayIdentifyingLandowners(response) &&
				questionHasAnswer(response, questions.identifyingLandowners, 'yes')
		)
		.addQuestion(questions.tellingLandowners)
		.withCondition(shouldDisplayTellingLandowners)
		.addQuestion(questions.inspectorAccess)
		.addQuestion(questions.healthAndSafety)
		.addQuestion(questions.enterApplicationReference)
		.addQuestion(questions.planningApplicationDate())
		.addQuestion(questions.enterDevelopmentDescription)
		.addQuestion(questions.updateDevelopmentDescription)
		.addQuestion(questions.anyOtherAppeals)
		.addQuestion(questions.linkAppeals)
		.withCondition((response) => questionHasAnswer(response, questions.anyOtherAppeals, 'yes')),
	new Section('Upload documents', 'upload-documents')
		.addQuestion(questions.uploadOriginalApplicationForm)
		.addQuestion(questions.uploadChangeOfDescriptionEvidence)
		.withCondition((response) =>
			questionHasAnswer(response, questions.updateDevelopmentDescription, 'yes')
		)
		.addQuestion(questions.uploadApplicationDecisionLetter)
		.addQuestion(questions.uploadAppellantStatement)
		.addQuestion(questions.costApplication)
		.addQuestion(questions.uploadCostApplication)
		.withCondition((response) => questionHasAnswer(response, questions.costApplication, 'yes'))
];

const baseHASSubmissionUrl = '/appeals/householder'; // this is a non standard naming and I'd like to remove it

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) => `${baseHASSubmissionUrl}?id=${response.referenceId}`;

const params = {
	journeyId: JOURNEY_TYPES.HAS_APPEAL_FORM,
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
	baseHASSubmissionUrl
};
