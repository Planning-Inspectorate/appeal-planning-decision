const { questions } = require('../../../dynamic-forms/questions');
const { Journey } = require('../../../dynamic-forms/journey');
const { Section } = require('../../../dynamic-forms/section');
const {
	questionHasAnswerBuilder
} = require('../../../dynamic-forms/dynamic-components/utils/question-has-answer');

const baseHASUrl = '/manage-appeals/questionnaire';
const hasJourneyTemplate = 'questionnaire-template.njk';
const listingPageViewPath = 'dynamic-components/task-list/questionnaire';
const journeyTitle = 'Manage your appeals';

/**
 * @typedef {import('../../../dynamic-forms/journey-response').JourneyResponse} JourneyResponse
 */

/**
 * A Journey for LPA's responding to a HAS appeal
 * @class
 */
class HasJourney extends Journey {
	/**
	 * creates an instance of a HAS Journey
	 * @param {JourneyResponse} response - an object that handles the response for this journey (needs to always be passed in as it contains the journey url segment)
	 */
	constructor(response) {
		super({
			baseUrl: `${baseHASUrl}/${encodeURIComponent(response.referenceId)}`,
			response: response,
			journeyTemplate: hasJourneyTemplate,
			listingPageViewPath: listingPageViewPath,
			journeyTitle: journeyTitle
		});

		const questionHasAnswer = questionHasAnswerBuilder(response);

		this.sections.push(
			new Section('Constraints, designations and other issues', 'constraints')
				.addQuestion(questions.appealTypeAppropriate)
				.addQuestion(questions.listedBuildingCheck)
				.addQuestion(questions.affectedListedBuildings)
				.withCondition(
					response.answers && response.answers[questions.listedBuildingCheck.fieldName] == 'yes'
				)
				.addQuestion(questions.conservationArea)
				.addQuestion(questions.conservationAreaUpload)
				.withCondition(
					response.answers && response.answers[questions.conservationArea.fieldName] == 'yes'
				)
				.addQuestion(questions.greenBelt),
			new Section('Notifying relevant parties of the application', 'notified')
				.addQuestion(questions.whoWasNotified)
				.addQuestion(questions.howYouNotifiedPeople)
				.addQuestion(questions.uploadSiteNotice)
				.withCondition(questionHasAnswer(questions.howYouNotifiedPeople, 'site-notice'))
				.addQuestion(questions.uploadNeighbourLetterAddresses)
				.withCondition(questionHasAnswer(questions.howYouNotifiedPeople, 'letters-or-emails'))
				.addQuestion(questions.pressAdvertUpload)
				.withCondition(questionHasAnswer(questions.howYouNotifiedPeople, 'advert')),
			new Section('Consultation responses and representations', 'consultation')
				.addQuestion(questions.representationsFromOthers)
				.addQuestion(questions.representationUpload)
				.withCondition(
					response.answers &&
						response.answers[questions.representationsFromOthers.fieldName] == 'yes'
				),
			new Section(
				"Planning officer's report and supplementary documents",
				'planning-officer-report'
			).addQuestion(questions.planningOfficersReportUpload),
			new Section('Site access', 'site-access')
				.addQuestion(questions.accessForInspection)
				.addQuestion(questions.neighbouringSite)
				.addQuestion(questions.neighbouringSitesToBeVisited)
				.withCondition(
					response.answers && response.answers[questions.neighbouringSite.fieldName] == 'yes'
				)
				.addQuestion(questions.potentialSafetyRisks),
			new Section('Appeal process', 'appeal-process')
				.addQuestion(questions.appealsNearSite)
				.addQuestion(questions.nearbyAppeals)
				.withCondition(
					response.answers && response.answers[questions.appealsNearSite.fieldName] == 'yes'
				)
				.addQuestion(questions.addNewConditions)
		);
	}
}

module.exports = { HasJourney, baseHASUrl };
