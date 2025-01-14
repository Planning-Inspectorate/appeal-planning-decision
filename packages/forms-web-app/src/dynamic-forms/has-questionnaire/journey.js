const { questions } = require('../questions');
const { Section } = require('../section');
const { questionHasAnswer } = require('../dynamic-components/utils/question-has-answer');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('../journey').Journey>[0], 'response'>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const sections = [
	new Section('Constraints, designations and other issues', 'constraints')
		.addQuestion(questions.appealTypeAppropriate)
		.addQuestion(questions.listedBuildingCheck)
		.addQuestion(questions.affectedListedBuildings)
		.withCondition(
			(response) =>
				response.answers && response.answers[questions.listedBuildingCheck.fieldName] == 'yes'
		)
		.addQuestion(questions.conservationArea)
		.addQuestion(questions.conservationAreaUpload)
		.withCondition(
			(response) =>
				response.answers && response.answers[questions.conservationArea.fieldName] == 'yes'
		)
		.addQuestion(questions.greenBelt),
	new Section('Notifying relevant parties', 'notified')
		.addQuestion(questions.whoWasNotified)
		.addQuestion(questions.howYouNotifiedPeople)
		.addQuestion(questions.uploadSiteNotice)
		.withCondition((response) =>
			questionHasAnswer(response, questions.howYouNotifiedPeople, 'site-notice')
		)
		.addQuestion(questions.uploadNeighbourLetterAddresses)
		.withCondition((response) =>
			questionHasAnswer(response, questions.howYouNotifiedPeople, 'letters-or-emails')
		)
		.addQuestion(questions.pressAdvertUpload)
		.withCondition((response) =>
			questionHasAnswer(response, questions.howYouNotifiedPeople, 'advert')
		),
	new Section('Consultation responses and representations', 'consultation')
		.addQuestion(questions.representationsFromOthers)
		.addQuestion(questions.representationUpload)
		.withCondition(
			(response) =>
				response.answers && response.answers[questions.representationsFromOthers.fieldName] == 'yes'
		),
	new Section("Planning officer's report and supporting documents", 'planning-officer-report')
		.addQuestion(questions.planningOfficersReportUpload)
		.addQuestion(questions.uploadPlansDrawingsHAS)
		.addQuestion(questions.uploadDevelopmentPlanPolicies)
		.addQuestion(questions.emergingPlan)
		.addQuestion(questions.emergingPlanUpload)
		.withCondition((response) => questionHasAnswer(response, questions.emergingPlan, 'yes'))
		.addQuestion(questions.supplementaryPlanning)
		.addQuestion(questions.supplementaryPlanningUpload)
		.withCondition((response) =>
			questionHasAnswer(response, questions.supplementaryPlanning, 'yes')
		),
	new Section('Site access', 'site-access')
		.addQuestion(questions.accessForInspection)
		.addQuestion(questions.neighbouringSite)
		.addQuestion(questions.neighbouringSitesToBeVisited)
		.withCondition(
			(response) =>
				response.answers && response.answers[questions.neighbouringSite.fieldName] == 'yes'
		)
		.addQuestion(questions.potentialSafetyRisks),
	new Section('Appeal process', 'appeal-process')
		.addQuestion(questions.appealsNearSite)
		.addQuestion(questions.nearbyAppeals)
		.withCondition(
			(response) =>
				response.answers && response.answers[questions.appealsNearSite.fieldName] == 'yes'
		)
		.addQuestion(questions.addNewConditions)
];

const baseHASUrl = '/manage-appeals/questionnaire';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) => `${baseHASUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE,
	sections,
	journeyTemplate: 'questionnaire-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/questionnaire',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Manage your appeals',
	makeBaseUrl
};

module.exports = { ...params, baseHASUrl };
