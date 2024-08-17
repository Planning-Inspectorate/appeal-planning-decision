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
 * @returns {Section[]}
 */
const buildSections = (response) => {
	const questionHasAnswer = questionHasAnswerBuilder(response);
	const questionsHaveAnswers = questionsHaveAnswersBuilder(response);

	const shouldDisplayIdentifyingLandowners = (() => {
		if (questionHasAnswer(questions.ownsAllLand, 'yes')) return false;
		if (
			questionHasAnswer(questions.ownsSomeLand, 'yes') &&
			questionHasAnswer(questions.knowsWhoOwnsRestOfLand, 'yes')
		)
			return false;
		if (
			questionHasAnswer(questions.ownsSomeLand, 'no') &&
			questionHasAnswer(questions.knowsWhoOwnsLandInvolved, 'yes')
		)
			return false;

		return true;
	})();

	const shouldDisplayTellingLandowners = (() => {
		if (questionHasAnswer(questions.ownsAllLand, 'yes')) return false;

		if (
			questionsHaveAnswers(
				[
					[questions.ownsSomeLand, 'yes'],
					[questions.knowsWhoOwnsRestOfLand, 'no']
				],
				{ logicalCombinator: 'and' }
			) ||
			questionsHaveAnswers(
				[
					[questions.ownsSomeLand, 'no'],
					[questions.knowsWhoOwnsLandInvolved, 'no']
				],
				{ logicalCombinator: 'and' }
			)
		)
			return false;

		return true;
	})();

	return [
		new Section('Prepare appeal', 'prepare-appeal')
			.addQuestion(questions.applicationName)
			.addQuestion(questions.applicantName)
			.withCondition(questionHasAnswer(questions.applicationName, 'no'))
			.addQuestion(questions.contactDetails)
			.addQuestion(questions.contactPhoneNumber)
			.addQuestion(questions.appealSiteAddress)
			.addQuestion(questions.siteArea)
			.addQuestion(questions.appellantGreenBelt)
			.addQuestion(questions.ownsAllLand)
			.addQuestion(questions.ownsSomeLand)
			.withCondition(questionHasAnswer(questions.ownsAllLand, 'no'))
			.addQuestion(questions.knowsWhoOwnsRestOfLand)
			.withCondition(
				questionsHaveAnswers(
					[
						[questions.ownsSomeLand, 'yes'],
						[questions.ownsAllLand, 'no']
					],
					{ logicalCombinator: 'and' }
				)
			)
			.addQuestion(questions.knowsWhoOwnsLandInvolved)
			.withCondition(
				questionsHaveAnswers(
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
				shouldDisplayIdentifyingLandowners &&
					questionHasAnswer(questions.identifyingLandowners, 'yes')
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
			.withCondition(questionHasAnswer(questions.anyOtherAppeals, 'yes')),
		new Section('Upload documents', 'upload-documents')
			.addQuestion(questions.uploadOriginalApplicationForm)
			.addQuestion(questions.uploadChangeOfDescriptionEvidence)
			.withCondition(questionHasAnswer(questions.updateDevelopmentDescription, 'yes'))
			.addQuestion(questions.uploadApplicationDecisionLetter)
			.addQuestion(questions.uploadAppellantStatement)
			.addQuestion(questions.costApplication)
			.addQuestion(questions.uploadCostApplication)
			.withCondition(questionHasAnswer(questions.costApplication, 'yes'))
	];
};

const fixedParams = {
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
		baseUrl: `${fixedParams.baseHASSubmissionUrl}?id=${response.referenceId}`,
		sections: buildSections(response)
	}
];

module.exports = {
	buildJourneyParams,
	...fixedParams
};
