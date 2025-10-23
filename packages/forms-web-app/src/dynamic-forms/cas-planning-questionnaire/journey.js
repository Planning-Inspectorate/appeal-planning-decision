const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('@pins/dynamic-forms/src/section');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');
const {
	CASE_TYPES: { CAS_PLANNING }
} = require('@pins/common/src/database/data-static');
const {
	questionHasAnswer
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
const { mapAppealTypeToDisplayText } = require('@pins/common/src/appeal-type-to-display-text');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('@pins/dynamic-forms/src/journey').Journey>[0], 'response'>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const makeSections = (response) => [
	new Section('Constraints, designations and other issues', 'constraints')
		.addQuestion(questions.appealTypeAppropriate)
		.withVariables({ [QUESTION_VARIABLES.APPEAL_TYPE]: mapAppealTypeToDisplayText(CAS_PLANNING) })
		.addQuestion(questions.listedBuildingCheck)
		.addQuestion(questions.affectedListedBuildings)
		.withCondition(
			() => response.answers && response.answers[questions.listedBuildingCheck.fieldName] == 'yes'
		)
		.addQuestion(questions.conservationArea)
		.addQuestion(questions.conservationAreaUpload)
		.withCondition(
			() => response.answers && response.answers[questions.conservationArea.fieldName] == 'yes'
		)
		.addQuestion(questions.greenBelt),
	new Section('Notifying relevant parties', 'notified')
		.addQuestion(questions.whoWasNotified)
		.addQuestion(questions.howYouNotifiedPeople)
		.addQuestion(questions.uploadSiteNotice)
		.withCondition(() => questionHasAnswer(response, questions.howYouNotifiedPeople, 'site-notice'))
		.addQuestion(questions.uploadNeighbourLetterAddresses)
		.withCondition(() =>
			questionHasAnswer(response, questions.howYouNotifiedPeople, 'letters-or-emails')
		)
		.addQuestion(questions.pressAdvertUpload)
		.withCondition(() => questionHasAnswer(response, questions.howYouNotifiedPeople, 'advert'))
		.addQuestion(questions.appealNotification),
	new Section('Consultation responses and representations', 'consultation')
		.addQuestion(questions.representationsFromOthers)
		.addQuestion(questions.representationUpload)
		.withCondition(
			() =>
				response.answers && response.answers[questions.representationsFromOthers.fieldName] == 'yes'
		),
	new Section("Planning officer's report and supporting documents", 'planning-officer-report')
		.addQuestion(questions.planningOfficersReportUpload)
		.addQuestion(questions.developmentPlanPolicies)
		.addQuestion(questions.uploadDevelopmentPlanPolicies)
		.withCondition(() => questionHasAnswer(response, questions.developmentPlanPolicies, 'yes'))
		.addQuestion(questions.emergingPlan)
		.addQuestion(questions.emergingPlanUpload)
		.withCondition(() => questionHasAnswer(response, questions.emergingPlan, 'yes'))
		.addQuestion(questions.supplementaryPlanning)
		.addQuestion(questions.supplementaryPlanningUpload)
		.withCondition(() => questionHasAnswer(response, questions.supplementaryPlanning, 'yes')),
	new Section('Site access', 'site-access')
		.addQuestion(questions.accessForInspection)
		.addQuestion(questions.neighbouringSite)
		.addQuestion(questions.neighbouringSitesToBeVisited)
		.withCondition(
			() => response.answers && response.answers[questions.neighbouringSite.fieldName] == 'yes'
		)
		.addQuestion(questions.potentialSafetyRisks),
	new Section('Appeal process', 'appeal-process')
		.addQuestion(questions.appealsNearSite)
		.addQuestion(questions.nearbyAppeals)
		.withCondition(
			() => response.answers && response.answers[questions.appealsNearSite.fieldName] == 'yes'
		)
		.addQuestion(questions.addNewConditions)
];

const baseCASPlanningUrl = '/manage-appeals/questionnaire';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseCASPlanningUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.CAS_PLANNING_QUESTIONNAIRE.id,
	makeSections,
	journeyTemplate: 'questionnaire-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/questionnaire',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Manage your appeals',
	makeBaseUrl
};

module.exports = { ...params, baseCASPlanningUrl };
