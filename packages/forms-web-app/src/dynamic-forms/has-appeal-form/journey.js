const { questions } = require('../questions');
const { Journey } = require('../journey');
const { Section } = require('../section');
const {
	questionHasAnswerBuilder,
	questionsHaveAnswersBuilder
} = require('../dynamic-components/utils/question-has-answer');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 */

const baseHASSubmissionUrl = '/appeals/householder';
const taskListUrl = 'appeal-form/your-appeal';
const hasJourneyTemplate = 'submission-form-template.njk';
const listingPageViewPath = 'dynamic-components/task-list/submission';
const informationPageViewPath = 'dynamic-components/submission-information/index';
const journeyTitle = 'Appeal a planning decision';

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

class HasAppealFormJourney extends Journey {
	/**
	 * creates an instance of a HAS Journey
	 * @param {JourneyResponse} response - an object that handles the response for this journey (needs to always be passed in as it contains the journey url segment)
	 */
	constructor(response) {
		super({
			baseUrl: `${baseHASSubmissionUrl}?id=${response.referenceId}`,
			taskListUrl: taskListUrl,
			response: response,
			journeyTemplate: hasJourneyTemplate,
			listingPageViewPath: listingPageViewPath,
			informationPageViewPath: informationPageViewPath,
			journeyTitle: journeyTitle,
			returnToListing: true,
			sections: buildSections(response)
		});
	}
}

module.exports = { HasAppealFormJourney, baseHASSubmissionUrl, taskListUrl };
