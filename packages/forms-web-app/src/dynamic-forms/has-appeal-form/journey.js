const { questions } = require('../questions');
const { Section } = require('../section');
const {
	questionHasAnswerBuilder,
	questionsHaveAnswersBuilder
} = require('../dynamic-components/utils/question-has-answer');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {ConstructorParameters<typeof import('../journey').Journey>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {boolean}
 */
const shouldDisplayIdentifyingLandowners = (response) => {
	if (questionHasAnswerBuilder(response)(questions.ownsAllLand, 'yes')) return false;
	if (
		questionHasAnswerBuilder(response)(questions.ownsSomeLand, 'yes') &&
		questionHasAnswerBuilder(response)(questions.knowsWhoOwnsRestOfLand, 'yes')
	)
		return false;
	if (
		questionHasAnswerBuilder(response)(questions.ownsSomeLand, 'no') &&
		questionHasAnswerBuilder(response)(questions.knowsWhoOwnsLandInvolved, 'yes')
	)
		return false;

	return true;
};

/**
 * @param {JourneyResponse} response
 * @returns {boolean}
 */
const shouldDisplayTellingLandowners = (response) => {
	if (questionHasAnswerBuilder(response)(questions.ownsAllLand, 'yes')) return false;

	if (
		questionsHaveAnswersBuilder(response)(
			[
				[questions.ownsSomeLand, 'yes'],
				[questions.knowsWhoOwnsRestOfLand, 'no']
			],
			{ logicalCombinator: 'and' }
		) ||
		questionsHaveAnswersBuilder(response)(
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
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.applicationName, 'no')
		)
		.addQuestion(questions.contactDetails)
		.addQuestion(questions.contactPhoneNumber)
		.addQuestion(questions.appealSiteAddress)
		.addQuestion(questions.siteArea)
		.addQuestion(questions.appellantGreenBelt)
		.addQuestion(questions.ownsAllLand)
		.addQuestion(questions.ownsSomeLand)
		.withCondition((response) => questionHasAnswerBuilder(response)(questions.ownsAllLand, 'no'))
		.addQuestion(questions.knowsWhoOwnsRestOfLand)
		.withCondition((response) =>
			questionsHaveAnswersBuilder(response)(
				[
					[questions.ownsSomeLand, 'yes'],
					[questions.ownsAllLand, 'no']
				],
				{ logicalCombinator: 'and' }
			)
		)
		.addQuestion(questions.knowsWhoOwnsLandInvolved)
		.withCondition((response) =>
			questionsHaveAnswersBuilder(response)(
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
				questionHasAnswerBuilder(response)(questions.identifyingLandowners, 'yes')
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
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.anyOtherAppeals, 'yes')
		),
	new Section('Upload documents', 'upload-documents')
		.addQuestion(questions.uploadOriginalApplicationForm)
		.addQuestion(questions.uploadChangeOfDescriptionEvidence)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.updateDevelopmentDescription, 'yes')
		)
		.addQuestion(questions.uploadApplicationDecisionLetter)
		.addQuestion(questions.uploadAppellantStatement)
		.addQuestion(questions.costApplication)
		.addQuestion(questions.uploadCostApplication)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.costApplication, 'yes')
		)
];

const fixedParams = {
	sections,
	baseHASSubmissionUrl: '/appeals/householder', // this is a non standard naming and I'd like to remove it
	taskListUrl: 'appeal-form/your-appeal',
	journeyTemplate: 'submission-form-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/submission',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Appeal a planning decision',
	returnToListing: true
};

/**
 * @param {JourneyResponse} response
 * @returns {JourneyParameters}
 */
const buildJourneyParams = (response) => [
	{
		...fixedParams,
		response,
		baseUrl: `${fixedParams.baseHASSubmissionUrl}?id=${response.referenceId}`
	}
];

module.exports = {
	buildJourneyParams,
	...fixedParams
};
