const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('@pins/dynamic-forms/src/section');
const {
	questionHasAnswer,
	questionsHaveAnswers
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
const { APPEAL_CASE_PROCEDURE } = require('@planning-inspectorate/data-model');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');
const {
	CASE_TYPES: { ENFORCEMENT }
} = require('@pins/common/src/database/data-static');
const config = require('../../config');
const {
	mapAppealTypeToDisplayText,
	mapAppealTypeToDisplayTextWithAnOrA
} = require('@pins/common/src/appeal-type-to-display-text');
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
		.withVariables({
			[QUESTION_VARIABLES.APPEAL_TYPE_WITH_AN_OR_A]:
				mapAppealTypeToDisplayTextWithAnOrA(ENFORCEMENT),
			[QUESTION_VARIABLES.APPEAL_TYPE]: mapAppealTypeToDisplayText(ENFORCEMENT)
		})
		.addQuestion(questions.changesListedBuilding)
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
		.addQuestion(questions.greenBelt)
		.addQuestion(questions.areaOfOutstandingNaturalBeauty)
		.addQuestion(questions.designatedSitesCheck)
		.addQuestion(questions.treePreservationOrder)
		.addQuestion(questions.treePreservationPlanUpload)
		.withCondition(() => questionHasAnswer(response, questions.treePreservationOrder, 'yes'))
		// right of way check to have different copy for enforcement
		.addQuestion(questions.rightOfWayCheck)
		.addQuestion(questions.uploadDefinitiveMap)
		.withCondition(() => questionHasAnswer(response, questions.rightOfWayCheck, 'yes')),
	// enforcement specific questions to follow here
	new Section('Environmental impact assessment', 'environmental-impact')
		.addQuestion(questions.environmentalImpactSchedule)
		.addQuestion(questions.developmentDescription)
		.withCondition(() =>
			questionHasAnswer(response, questions.environmentalImpactSchedule, 'schedule-2')
		)
		.addQuestion(questions.sensitiveArea)
		.withCondition(() =>
			questionHasAnswer(response, questions.environmentalImpactSchedule, 'schedule-2')
		)
		.addQuestion(questions.meetsColumnTwoThreshold)
		.withCondition(() =>
			questionHasAnswer(response, questions.environmentalImpactSchedule, 'schedule-2')
		)
		.addQuestion(questions.screeningOpinion)
		.withCondition(() =>
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
			() =>
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
			() =>
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
			() =>
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
			() =>
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
		.withCondition(() => questionHasAnswer(response, questions.submitEnvironmentalStatement, 'yes'))
		.addQuestion(questions.uploadScreeningDirection)
		.withCondition(() =>
			questionsHaveAnswers(
				response,
				[
					[questions.submitEnvironmentalStatement, 'no'],
					[questions.environmentalImpactSchedule, 'schedule-2'],
					[questions.screeningOpinion, 'yes']
				],
				{ logicalCombinator: 'and' }
			)
		),
	// new section with enforcement specific questions
	// new Section('Notifying relevant parties', 'notified'),
	new Section('Planning officer’s report and supporting documents', 'planning-officer-report')
		.addQuestion(questions.planningOfficersReportUpload)
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
		.withCondition(() => questionHasAnswer(response, questions.supplementaryPlanning, 'yes'))
		.addQuestion(questions.communityInfrastructureLevy)
		.addQuestion(questions.communityInfrastructureLevyUpload)
		.withCondition(() => questionHasAnswer(response, questions.communityInfrastructureLevy, 'yes'))
		.addQuestion(questions.communityInfrastructureLevyAdopted)
		.withCondition(() => questionHasAnswer(response, questions.communityInfrastructureLevy, 'yes'))
		.addQuestion(questions.communityInfrastructureLevyAdoptedDate)
		.withCondition(() =>
			questionsHaveAnswers(response, [
				[questions.communityInfrastructureLevy, 'yes'],
				[questions.communityInfrastructureLevyAdopted, 'yes']
			])
		)
		.addQuestion(questions.communityInfrastructureLevyAdoptDate)
		.withCondition(() =>
			questionsHaveAnswers(response, [
				[questions.communityInfrastructureLevy, 'yes'],
				[questions.communityInfrastructureLevyAdopted, 'no']
			])
		),
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

const baseEnforcementUrl = '/manage-appeals/questionnaire';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseEnforcementUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.ENFORCEMENT_QUESTIONNAIRE.id,
	makeSections,
	journeyTemplate: 'questionnaire-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/questionnaire',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Manage your appeals',
	makeBaseUrl
};

module.exports = { ...params, baseEnforcementUrl };
