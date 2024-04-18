const { questions } = require('../questions');
const { Journey } = require('../journey');
const { Section } = require('../section');
const {
	questionHasAnswerBuilder,
	questionsHaveAnswersBuilder
} = require('../dynamic-components/utils/question-has-answer');

const baseHASSubmissionUrl = '/appeals/householder';
const hasJourneyTemplate = 'submission-form-template.njk';
const listingPageViewPath = 'dynamic-components/task-list/submission'; // Page does not exist yet
const journeyTitle = 'Appeal a planning decision';

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 */

/**
 * A Journey for appellants starting an appeal
 * @class
 */
class HasAppealFormJourney extends Journey {
	/**
	 * creates an instance of a HAS Journey
	 * @param {JourneyResponse} response - an object that handles the response for this journey (needs to always be passed in as it contains the journey url segment)
	 */
	constructor(response) {
		super(
			`${baseHASSubmissionUrl}?id=${response.referenceId}`,
			response,
			hasJourneyTemplate,
			listingPageViewPath,
			journeyTitle
		);

		const questionHasAnswer = questionHasAnswerBuilder(response);
		const questionsHaveAnswers = questionsHaveAnswersBuilder(response);

		this.sections.push(
			new Section('Site details', 'site-details')
				.addQuestion(questions.siteArea)
				.addQuestion(questions.greenBelt)
				.addQuestion(questions.ownsAllLand)
				.addQuestion(questions.ownsSomeLand)
				.withCondition(questionHasAnswer(questions.ownsAllLand, 'no'))
				.addQuestion(questions.ownsRestOfLand)
				.withCondition(questionHasAnswer(questions.ownsSomeLand, 'yes'))
				.addQuestion(questions.ownsLandInvolved)
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
				.withCondition(
					questionsHaveAnswers(
						[
							[questions.ownsRestOfLand, 'some'],
							[questions.ownsRestOfLand, 'no'],
							[questions.ownsLandInvolved, 'some'],
							[questions.ownsLandInvolved, 'no']
						],
						{ logicalCombinator: 'or' }
					)
				)
				.addQuestion(questions.advertisingAppeal)
				.withCondition(questionHasAnswer(questions.identifyingLandowners, 'yes'))
				.addQuestion(questions.tellingLandowners)
				.withCondition(
					questionsHaveAnswers(
						[
							[questions.ownsRestOfLand, 'yes'],
							[questions.ownsLandInvolved, 'yes']
						],
						{ logicalCombinator: 'or' }
					) ||
						(questionsHaveAnswers(
							[
								[questions.ownsRestOfLand, 'some'],
								[questions.ownsLandInvolved, 'some']
							],
							{ logicalCombinator: 'or' }
						) &&
							questionHasAnswer(questions.advertisingAppeal, 'yes'))
				)
				.addQuestion(questions.inspectorAccess)
				.addQuestion(questions.healthAndSafety),
			new Section('Your application', 'your-application')
				.addQuestion(questions.enterApplicationReference)
				.addQuestion(questions.planningApplicationDate)
				.addQuestion(questions.enterDevelopmentDescription)
				.addQuestion(questions.updateDevelopmentDescription),
			new Section('Application', 'application')
				.addQuestion(questions.uploadOriginalApplicationForm)
				.addQuestion(questions.uploadChangeOfDescriptionEvidence)
				.addQuestion(questions.uploadApplicationDecisionLetter),
			new Section('Appeal documents', 'appeal-documents')
				.addQuestion(questions.uploadAppellantStatement)
				.addQuestion(questions.costApplication)
				.addQuestion(questions.uploadCostApplication)
				.withCondition(questionHasAnswer(questions.costApplication, 'yes'))
		);
	}
}

module.exports = { HasAppealFormJourney, baseHASSubmissionUrl };
