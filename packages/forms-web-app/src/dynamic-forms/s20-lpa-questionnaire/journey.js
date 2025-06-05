const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('../section');
const {
	questionHasAnswer,
	questionsHaveAnswers
} = require('../dynamic-components/utils/question-has-answer');
const { APPEAL_CASE_PROCEDURE } = require('pins-data-model');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');
const config = require('../../config');
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
		.withVariables({ [QUESTION_VARIABLES.APPEAL_TYPE]: 'listed building consent' })
		.addQuestion(questions.changesListedBuilding)
		.addQuestion(questions.changedListedBuildings)
		.withCondition((response) =>
			questionHasAnswer(response, questions.changesListedBuilding, 'yes')
		)
		.addQuestion(questions.listedBuildingCheck)
		.addQuestion(questions.affectedListedBuildings)
		.withCondition((response) => questionHasAnswer(response, questions.listedBuildingCheck, 'yes'))
		.addQuestion(questions.grantOrLoan)
		.addQuestion(questions.consultHistoricEngland)
		.addQuestion(questions.uploadHistoricEnglandConsultation)
		.withCondition((response) =>
			questionHasAnswer(response, questions.consultHistoricEngland, 'yes')
		)
		.addQuestion(questions.scheduledMonument)
		.addQuestion(questions.conservationArea)
		.addQuestion(questions.conservationAreaUpload)
		.withCondition((response) => questionHasAnswer(response, questions.conservationArea, 'yes'))
		.addQuestion(questions.protectedSpecies)
		.addQuestion(questions.greenBelt)
		.addQuestion(questions.areaOfOutstandingNaturalBeauty)
		.addQuestion(questions.designatedSitesCheck)
		.addQuestion(questions.treePreservationOrder)
		.addQuestion(questions.treePreservationPlanUpload)
		.withCondition((response) =>
			questionHasAnswer(response, questions.treePreservationOrder, 'yes')
		)
		.addQuestion(questions.gypsyOrTraveller)
		.addQuestion(questions.rightOfWayCheck)
		.addQuestion(questions.uploadDefinitiveMap)
		.withCondition((response) => questionHasAnswer(response, questions.rightOfWayCheck, 'yes')),
	new Section('Environmental impact assessment', 'environmental-impact')
		.addQuestion(questions.environmentalImpactSchedule)
		.addQuestion(questions.developmentDescription)
		.withCondition((response) =>
			questionHasAnswer(response, questions.environmentalImpactSchedule, 'schedule-2')
		)
		.addQuestion(questions.sensitiveArea)
		.withCondition((response) =>
			questionHasAnswer(response, questions.environmentalImpactSchedule, 'schedule-2')
		)
		.addQuestion(questions.meetsColumnTwoThreshold)
		.withCondition((response) =>
			questionHasAnswer(response, questions.environmentalImpactSchedule, 'schedule-2')
		)
		.addQuestion(questions.screeningOpinion)
		.withCondition((response) =>
			questionsHaveAnswers(
				response,
				[
					[questions.environmentalImpactSchedule, 'schedule-2'],
					[questions.environmentalImpactSchedule, 'no']
				],
				{ logicalCombinator: 'or' }
			)
		)
		.addQuestion(questions.screeningOpinionUpload)
		.withCondition(
			(response) =>
				questionHasAnswer(response, questions.screeningOpinion, 'yes') &&
				questionsHaveAnswers(
					response,
					[
						[questions.environmentalImpactSchedule, 'schedule-2'],
						[questions.environmentalImpactSchedule, 'no']
					],
					{ logicalCombinator: 'or' }
				)
		)
		.addQuestion(questions.screeningOpinionEnvironmentalStatement)
		.withCondition(
			(response) =>
				questionHasAnswer(response, questions.screeningOpinion, 'yes') &&
				questionsHaveAnswers(
					response,
					[
						[questions.environmentalImpactSchedule, 'schedule-2'],
						[questions.environmentalImpactSchedule, 'no']
					],
					{ logicalCombinator: 'or' }
				)
		)
		.addQuestion(questions.scopingOpinion)
		.withCondition(
			(response) =>
				questionsHaveAnswers(
					response,
					[
						[questions.screeningOpinion, 'yes'],
						[questions.screeningOpinionEnvironmentalStatement, 'yes']
					],
					{ logicalCombinator: 'and' }
				) && config.featureFlag.scopingOpinionEnabled
		)
		.addQuestion(questions.scopingOpinionUpload)
		.withCondition(
			(response) =>
				questionsHaveAnswers(
					response,
					[
						[questions.scopingOpinion, 'yes'],
						[questions.screeningOpinion, 'yes'],
						[questions.screeningOpinionEnvironmentalStatement, 'yes']
					],
					{ logicalCombinator: 'and' }
				) && config.featureFlag.scopingOpinionEnabled
		)
		.addQuestion(questions.submitEnvironmentalStatement)
		.addQuestion(questions.uploadEnvironmentalStatement)
		.withCondition((response) =>
			questionHasAnswer(response, questions.submitEnvironmentalStatement, 'yes')
		)
		.addQuestion(questions.uploadScreeningDirection)
		.withCondition((response) =>
			questionHasAnswer(response, questions.submitEnvironmentalStatement, 'no')
		),
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
		)
		.addQuestion(questions.appealNotification),
	new Section('Consultation responses and representations', 'consultation')
		.addQuestion(questions.statutoryConsultees)
		.addQuestion(questions.consultationResponses)
		.addQuestion(questions.consultationResponsesUpload)
		.withCondition((response) =>
			questionHasAnswer(response, questions.consultationResponses, 'yes')
		)
		.addQuestion(questions.representationsFromOthers)
		.addQuestion(questions.representationUpload)
		.withCondition((response) =>
			questionHasAnswer(response, questions.representationsFromOthers, 'yes')
		),
	new Section('Planning officer’s report and supporting documents', 'planning-officer-report')
		.addQuestion(questions.planningOfficersReportUpload)
		.addQuestion(questions.developmentPlanPolicies)
		.addQuestion(questions.uploadDevelopmentPlanPolicies)
		.withCondition((response) =>
			questionHasAnswer(response, questions.developmentPlanPolicies, 'yes')
		)
		.addQuestion(questions.emergingPlan)
		.addQuestion(questions.emergingPlanUpload)
		.withCondition((response) => questionHasAnswer(response, questions.emergingPlan, 'yes'))
		.addQuestion(questions.otherRelevantPolicies)
		.addQuestion(questions.uploadOtherRelevantPolicies)
		.withCondition((response) =>
			questionHasAnswer(response, questions.otherRelevantPolicies, 'yes')
		)
		.addQuestion(questions.supplementaryPlanning)
		.addQuestion(questions.supplementaryPlanningUpload)
		.withCondition((response) =>
			questionHasAnswer(response, questions.supplementaryPlanning, 'yes')
		)
		.addQuestion(questions.communityInfrastructureLevy)
		.addQuestion(questions.communityInfrastructureLevyUpload)
		.withCondition((response) =>
			questionHasAnswer(response, questions.communityInfrastructureLevy, 'yes')
		)
		.addQuestion(questions.communityInfrastructureLevyAdopted)
		.withCondition((response) =>
			questionHasAnswer(response, questions.communityInfrastructureLevy, 'yes')
		)
		.addQuestion(questions.communityInfrastructureLevyAdoptedDate)
		.withCondition((response) =>
			questionsHaveAnswers(response, [
				[questions.communityInfrastructureLevy, 'yes'],
				[questions.communityInfrastructureLevyAdopted, 'yes']
			])
		)
		.addQuestion(questions.communityInfrastructureLevyAdoptDate)
		.withCondition((response) =>
			questionsHaveAnswers(response, [
				[questions.communityInfrastructureLevy, 'yes'],
				[questions.communityInfrastructureLevyAdopted, 'no']
			])
		),
	new Section('Site access', 'site-access')
		.addQuestion(questions.accessForInspection)
		.addQuestion(questions.neighbouringSite)
		.addQuestion(questions.neighbouringSitesToBeVisited)
		.withCondition((response) => questionHasAnswer(response, questions.neighbouringSite, 'yes'))
		.addQuestion(questions.potentialSafetyRisks),
	new Section('Appeal process', 'appeal-process')
		.addQuestion(questions.procedureType)
		.addQuestion(questions.whyInquiry)
		.withCondition((response) =>
			questionHasAnswer(response, questions.procedureType, APPEAL_CASE_PROCEDURE.INQUIRY)
		)
		.addQuestion(questions.whyHearing)
		.withCondition((response) =>
			questionHasAnswer(response, questions.procedureType, APPEAL_CASE_PROCEDURE.HEARING)
		)
		.addQuestion(questions.appealsNearSite)
		.addQuestion(questions.nearbyAppeals)
		.withCondition((response) => questionHasAnswer(response, questions.appealsNearSite, 'yes'))
		.addQuestion(questions.addNewConditions)
];

const baseS20LpaqUrl = '/manage-appeals/questionnaire'; // TODO: To be changed to '/manage-appeals/listed-building';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) => `${baseS20LpaqUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.S20_LPA_QUESTIONNAIRE,
	sections,
	journeyTemplate: 'questionnaire-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/questionnaire',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Manage your appeals',
	makeBaseUrl
};

module.exports = { ...params, baseS20LpaqUrl };
