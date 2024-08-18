const { questions } = require('../questions');
const { Section } = require('../section');
const {
	questionHasAnswerBuilder,
	questionsHaveAnswersBuilder
} = require('../dynamic-components/utils/question-has-answer');
const { APPEAL_CASE_PROCEDURE } = require('pins-data-model');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {ConstructorParameters<typeof import('../journey').Journey>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const sections = [
	new Section('Constraints, designations and other issues', 'constraints')
		.addQuestion(questions.appealTypeAppropriate)
		.addQuestion(questions.changesListedBuilding)
		.addQuestion(questions.changedListedBuildings)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.changesListedBuilding, 'yes')
		)
		.addQuestion(questions.listedBuildingCheck)
		.addQuestion(questions.affectedListedBuildings)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.listedBuildingCheck, 'yes')
		)
		.addQuestion(questions.scheduledMonument)
		.addQuestion(questions.conservationArea)
		.addQuestion(questions.conservationAreaUpload)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.conservationArea, 'yes')
		)
		.addQuestion(questions.protectedSpecies)
		.addQuestion(questions.greenBelt)
		.addQuestion(questions.areaOfOutstandingNaturalBeauty)
		.addQuestion(questions.designatedSitesCheck)
		.addQuestion(questions.treePreservationOrder)
		.addQuestion(questions.treePreservationPlanUpload)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.treePreservationOrder, 'yes')
		)
		.addQuestion(questions.gypsyOrTraveller)
		.addQuestion(questions.rightOfWayCheck)
		.addQuestion(questions.uploadDefinitiveMap)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.rightOfWayCheck, 'yes')
		),
	new Section('Environmental impact assessment', 'environmental-impact')
		.addQuestion(questions.environmentalImpactSchedule)
		.addQuestion(questions.developmentDescription)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.environmentalImpactSchedule, 'schedule-2')
		)
		.addQuestion(questions.sensitiveArea)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.environmentalImpactSchedule, 'schedule-2')
		)
		.addQuestion(questions.meetsColumnTwoThreshold)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.environmentalImpactSchedule, 'schedule-2')
		)
		.addQuestion(questions.screeningOpinion)
		.withCondition((response) =>
			questionsHaveAnswersBuilder(response)(
				[
					[questions.environmentalImpactSchedule, 'schedule-2'],
					[questions.environmentalImpactSchedule, 'no']
				],
				{ logicalCombinator: 'or' }
			)
		)
		.addQuestion(questions.screeningOpinionUpload)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.screeningOpinion, 'yes')
		)
		.addQuestion(questions.screeningOpinionEnvironmentalStatement)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.screeningOpinion, 'yes')
		)
		.addQuestion(questions.submitEnvironmentalStatement)
		.addQuestion(questions.uploadEnvironmentalStatement)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.submitEnvironmentalStatement, 'yes')
		)
		.addQuestion(questions.uploadScreeningDirection)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.submitEnvironmentalStatement, 'no')
		),
	new Section('Notifying relevant parties of the application', 'notified')
		.addQuestion(questions.whoWasNotified)
		.addQuestion(questions.howYouNotifiedPeople)
		.addQuestion(questions.uploadSiteNotice)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.howYouNotifiedPeople, 'site-notice')
		)
		.addQuestion(questions.uploadNeighbourLetterAddresses)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.howYouNotifiedPeople, 'letters-or-emails')
		)
		.addQuestion(questions.pressAdvertUpload)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.howYouNotifiedPeople, 'advert')
		),
	new Section('Consultation responses and representations', 'consultation')
		.addQuestion(questions.statutoryConsultees)
		.addQuestion(questions.consultationResponses)
		.addQuestion(questions.consultationResponsesUpload)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.consultationResponses, 'yes')
		)
		.addQuestion(questions.representationsFromOthers)
		.addQuestion(questions.representationUpload)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.representationsFromOthers, 'yes')
		),
	new Section('Planning officer’s report and supporting documents', 'planning-officer-report')
		.addQuestion(questions.planningOfficersReportUpload)
		.addQuestion(questions.uploadDevelopmentPlanPolicies)
		.addQuestion(questions.emergingPlan)
		.addQuestion(questions.emergingPlanUpload)
		.withCondition((response) => questionHasAnswerBuilder(response)(questions.emergingPlan, 'yes'))
		.addQuestion(questions.uploadOtherRelevantPolicies)
		.addQuestion(questions.supplementaryPlanning)
		.addQuestion(questions.supplementaryPlanningUpload)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.supplementaryPlanning, 'yes')
		)
		.addQuestion(questions.communityInfrastructureLevy)
		.addQuestion(questions.communityInfrastructureLevyUpload)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.communityInfrastructureLevy, 'yes')
		)
		.addQuestion(questions.communityInfrastructureLevyAdopted)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.communityInfrastructureLevy, 'yes')
		)
		.addQuestion(questions.communityInfrastructureLevyAdoptedDate())
		.withCondition((response) =>
			questionsHaveAnswersBuilder(response)([
				[questions.communityInfrastructureLevy, 'yes'],
				[questions.communityInfrastructureLevyAdopted, 'yes']
			])
		)
		.addQuestion(questions.communityInfrastructureLevyAdoptDate())
		.withCondition((response) =>
			questionsHaveAnswersBuilder(response)([
				[questions.communityInfrastructureLevy, 'yes'],
				[questions.communityInfrastructureLevyAdopted, 'no']
			])
		),
	new Section('Site access', 'site-access')
		.addQuestion(questions.accessForInspection)
		.addQuestion(questions.neighbouringSite)
		.addQuestion(questions.neighbouringSitesToBeVisited)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.neighbouringSite, 'yes')
		)
		.addQuestion(questions.potentialSafetyRisks),
	new Section('Appeal process', 'appeal-process')
		.addQuestion(questions.procedureType)
		.addQuestion(questions.whyInquiry)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.procedureType, APPEAL_CASE_PROCEDURE.INQUIRY)
		)
		.addQuestion(questions.whyHearing)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.procedureType, APPEAL_CASE_PROCEDURE.HEARING)
		)
		.addQuestion(questions.appealsNearSite)
		.addQuestion(questions.nearbyAppeals)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.appealsNearSite, 'yes')
		)
		.addQuestion(questions.addNewConditions)
];

const fixedParams = {
	sections,
	baseS78Url: '/manage-appeals/questionnaire',
	journeyTemplate: 'questionnaire-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/questionnaire',
	journeyTitle: 'Manage your appeals'
};

/**
 * @param {JourneyResponse} response
 * @returns {JourneyParameters}
 */
const buildJourneyParams = (response) => [
	{
		...fixedParams,
		baseUrl: `${fixedParams.baseS78Url}/${encodeURIComponent(response.referenceId)}`,
		response: response
	}
];

module.exports = { buildJourneyParams, ...fixedParams };
