const { questions } = require('../questions');
const { Journey } = require('../journey');
const { Section } = require('../section');
const { questionHasAnswerBuilder } = require('../dynamic-components/utils/question-has-answer');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {ConstructorParameters<typeof Journey>} JourneyParameters
 */

const fixedParams = {
	baseHASUrl: '/manage-appeals/questionnaire',
	journeyTemplate: 'questionnaire-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/questionnaire',
	journeyTitle: 'Manage your appeals'
};

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const buildSections = (response) => {
	const questionHasAnswer = questionHasAnswerBuilder(response);

	return [
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
				response.answers && response.answers[questions.representationsFromOthers.fieldName] == 'yes'
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
	];
};

/**
 * @param {JourneyResponse} response
 * @returns {JourneyParameters}
 */
const buildJourneyParams = (response) => [
	{
		...fixedParams,
		response,
		baseUrl: `${fixedParams.baseHASUrl}/${encodeURIComponent(response.referenceId)}`,
		sections: buildSections(response)
	}
];

class HasJourney extends Journey {
	/**
	 * creates an instance of a HAS Journey
	 * @param {JourneyResponse} response - an object that handles the response for this journey (needs to always be passed in as it contains the journey url segment)
	 */
	constructor(response) {
		super(...buildJourneyParams(response));
	}
}

module.exports = { HasJourney, ...fixedParams };
