const { getQuestions } = require('../questions');
const { Section } = require('@pins/dynamic-forms/src/section');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');
const {
	CASE_TYPES: { ADVERTS, CAS_ADVERTS }
} = require('@pins/common/src/database/data-static');
const {
	questionHasAnswer
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
const {
	mapAppealTypeToDisplayText,
	mapAppealTypeToDisplayTextWithAnOrA
} = require('@pins/common/src/appeal-type-to-display-text');
const { APPEAL_CASE_PROCEDURE } = require('@planning-inspectorate/data-model');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('@pins/dynamic-forms/src/journey').Journey>[0], 'response'>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const makeSections = (response) => {
	const questions = getQuestions(response);
	return [
		new Section('Constraints, designations and other issues', 'constraints')
			.addQuestion(questions.appealTypeAppropriate)
			.withVariables({
				[QUESTION_VARIABLES.APPEAL_TYPE_WITH_AN_OR_A]:
					response.journeyId === JOURNEY_TYPES.ADVERTS_QUESTIONNAIRE.id
						? mapAppealTypeToDisplayTextWithAnOrA(ADVERTS)
						: mapAppealTypeToDisplayTextWithAnOrA(CAS_ADVERTS),
				[QUESTION_VARIABLES.APPEAL_TYPE]:
					response.journeyId === JOURNEY_TYPES.ADVERTS_QUESTIONNAIRE.id
						? mapAppealTypeToDisplayText(ADVERTS)
						: mapAppealTypeToDisplayText(CAS_ADVERTS)
			})
			.addQuestion(questions.changesListedBuilding)
			.withCondition(() => response.journeyId === JOURNEY_TYPES.ADVERTS_QUESTIONNAIRE.id)
			.addQuestion(questions.changedListedBuildings)
			.withCondition(() => questionHasAnswer(response, questions.changesListedBuilding, 'yes'))
			.addQuestion(questions.listedBuildingCheck)
			.addQuestion(questions.affectedListedBuildings)
			.withCondition(() => questionHasAnswer(response, questions.listedBuildingCheck, 'yes'))
			.addQuestion(questions.scheduledMonument)
			.addQuestion(questions.conservationArea)
			.addQuestion(questions.conservationAreaUpload)
			.withCondition(() => questionHasAnswer(response, questions.conservationArea, 'yes'))
			.addQuestion(questions.protectedSpecies)
			.addQuestion(questions.isSiteInAreaOfSpecialControlAdverts)
			.addQuestion(questions.greenBelt)
			.addQuestion(questions.areaOfOutstandingNaturalBeauty)
			.addQuestion(questions.designatedSitesCheck),
		new Section('Notifying relevant parties', 'notified')
			.addQuestion(questions.whoWasNotified)
			.addQuestion(questions.howYouNotifiedPeople)
			.addQuestion(questions.uploadSiteNotice)
			.withCondition(() =>
				questionHasAnswer(response, questions.howYouNotifiedPeople, 'site-notice')
			)
			.addQuestion(questions.uploadNeighbourLetterAddresses)
			.withCondition(() =>
				questionHasAnswer(response, questions.howYouNotifiedPeople, 'letters-or-emails')
			)
			.addQuestion(questions.pressAdvertUpload)
			.withCondition(() => questionHasAnswer(response, questions.howYouNotifiedPeople, 'advert'))
			.addQuestion(questions.appealNotification),
		new Section('Consultation responses and representations', 'consultation')
			.addQuestion(questions.statutoryConsultees)
			.addQuestion(questions.representationsFromOthers)
			.addQuestion(questions.representationUpload)
			.withCondition(() => questionHasAnswer(response, questions.representationsFromOthers, 'yes')),
		new Section('Planning officer’s report and supporting documents', 'planning-officer-report')
			.addQuestion(questions.planningOfficersReportUpload)
			.addQuestion(questions.wasApplicationRefusedDueToHighwayOrTraffic)
			.addQuestion(questions.didAppellantSubmitCompletePhotosAndPlans)
			.addQuestion(questions.developmentPlanPolicies)
			.addQuestion(questions.uploadDevelopmentPlanPolicies)
			.withCondition(() => questionHasAnswer(response, questions.developmentPlanPolicies, 'yes'))
			.addQuestion(questions.emergingPlan)
			.addQuestion(questions.emergingPlanUpload)
			.withCondition(() => questionHasAnswer(response, questions.emergingPlan, 'yes'))
			.addQuestion(questions.otherRelevantPolicies)
			.addQuestion(questions.uploadOtherRelevantPolicies)
			.withCondition(() => questionHasAnswer(response, questions.otherRelevantPolicies, 'yes'))
			.addQuestion(questions.supplementaryPlanning)
			.addQuestion(questions.supplementaryPlanningUpload)
			.withCondition(() => questionHasAnswer(response, questions.supplementaryPlanning, 'yes')),
		new Section('Site access', 'site-access')
			.addQuestion(questions.accessForInspection)
			.addQuestion(questions.neighbouringSite)
			.addQuestion(questions.neighbouringSitesToBeVisited)
			.withCondition(() => questionHasAnswer(response, questions.neighbouringSite, 'yes'))
			.addQuestion(questions.potentialSafetyRisks),
		new Section('Appeal process', 'appeal-process')
			.addQuestion(questions.procedureType)
			.addQuestion(questions.whyInquiry)
			.withCondition(() =>
				questionHasAnswer(response, questions.procedureType, APPEAL_CASE_PROCEDURE.INQUIRY)
			)
			.addQuestion(questions.whyHearing)
			.withCondition(() =>
				questionHasAnswer(response, questions.procedureType, APPEAL_CASE_PROCEDURE.HEARING)
			)
			.addQuestion(questions.appealsNearSite)
			.addQuestion(questions.nearbyAppeals)
			.withCondition(() => questionHasAnswer(response, questions.appealsNearSite, 'yes'))
			.addQuestion(questions.addNewConditions)
	];
};

const baseAdvertsMinorUrl = '/manage-appeals/questionnaire';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseAdvertsMinorUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const casAdvertsParams = {
	journeyId: JOURNEY_TYPES.CAS_ADVERTS_QUESTIONNAIRE.id,
	makeSections,
	journeyTemplate: 'questionnaire-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/questionnaire',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Manage your appeals',
	makeBaseUrl
};
/** @type {JourneyParameters} */
const advertsParams = {
	journeyId: JOURNEY_TYPES.ADVERTS_QUESTIONNAIRE.id,
	makeSections,
	journeyTemplate: 'questionnaire-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/questionnaire',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Manage your appeals',
	makeBaseUrl
};

module.exports = {
	adverts: {
		...advertsParams,
		baseAdvertsMinorUrl
	},
	casAdverts: {
		...casAdvertsParams,
		baseAdvertsMinorUrl
	}
};
