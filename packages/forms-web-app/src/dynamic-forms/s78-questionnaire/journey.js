const { questions } = require('../questions');
const { Journey } = require('../journey');
const { Section } = require('../section');
const {
	questionHasAnswerBuilder,
	questionsHaveAnswersBuilder
} = require('../dynamic-components/utils/question-has-answer');

const baseS78Url = '/manage-appeals/questionnaire';
const s78JourneyTemplate = 'questionnaire-template.njk';
const listingPageViewPath = 'dynamic-components/task-list/questionnaire';
const journeyTitle = 'Manage your appeals';

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 */

/**
 * A Journey for LPAs responding to a S78 appeal
 * @class
 */
class S78Journey extends Journey {
	/**
	 * creates an instance of a S78 Journey
	 * @param {JourneyResponse} response - an object that handles the response for this journey (needs to always be passed in as it contains the journey url segment)
	 */
	constructor(response) {
		super(
			`${baseS78Url}/${encodeURIComponent(response.referenceId)}`,
			response,
			s78JourneyTemplate,
			listingPageViewPath,
			journeyTitle
		);

		const questionHasAnswer = questionHasAnswerBuilder(response);
		const questionsHaveAnswers = questionsHaveAnswersBuilder(response);

		this.sections.push(
			new Section('Constraints, designations and other issues', 'constraints')
				.addQuestion(questions.appealTypeAppropriate)
				.addQuestion(questions.changesListedBuilding)
				.addQuestion(questions.changedListedBuildingNumber)
				.withCondition(questionHasAnswer(questions.changesListedBuilding, 'yes'))
				.addQuestion(questions.listedBuildingCheck)
				.addQuestion(questions.affectedListedBuildings)
				.withCondition(questionHasAnswer(questions.listedBuildingCheck, 'yes'))
				.addQuestion(questions.scheduledMonument)
				.addQuestion(questions.conservationArea)
				.addQuestion(questions.conservationAreaUpload)
				.withCondition(questionHasAnswer(questions.conservationArea, 'yes'))
				.addQuestion(questions.protectedSpecies)
				.addQuestion(questions.greenBelt)
				.addQuestion(questions.areaOfOutstandingNaturalBeauty)
				.addQuestion(questions.designatedSitesCheck)
				.addQuestion(questions.treePreservationOrder)
				.addQuestion(questions.treePreservationPlanUpload)
				.withCondition(questionHasAnswer(questions.treePreservationOrder, 'yes'))
				.addQuestion(questions.gypsyOrTraveller)
				.addQuestion(questions.rightOfWayCheck)
				.addQuestion(questions.uploadDefinitiveMap)
				.withCondition(questionHasAnswer(questions.rightOfWayCheck, 'yes')),
			new Section('Environmental impact assessment', 'environmental-impact')
				.addQuestion(questions.environmentalImpactSchedule)
				.addQuestion(questions.developmentDescription)
				.withCondition(questionHasAnswer(questions.environmentalImpactSchedule, 'schedule-2'))
				.addQuestion(questions.sensitiveArea)
				.withCondition(questionHasAnswer(questions.environmentalImpactSchedule, 'schedule-2'))
				.addQuestion(questions.meetsColumnTwoThreshold)
				.withCondition(questionHasAnswer(questions.environmentalImpactSchedule, 'schedule-2'))
				.addQuestion(questions.screeningOpinion)
				.withCondition(questionHasAnswer(questions.environmentalImpactSchedule, 'no'))
				.addQuestion(questions.screeningOpinionUpload)
				.withCondition(
					questionsHaveAnswers([
						[questions.environmentalImpactSchedule, 'no'],
						[questions.screeningOpinion, 'yes']
					])
				)
				.addQuestion(questions.screeningOpinionEnvironmentalStatement)
				.withCondition(
					questionsHaveAnswers([
						[questions.environmentalImpactSchedule, 'no'],
						[questions.screeningOpinion, 'yes']
					])
				)
				.addQuestion(questions.submitEnvironmentalStatement)
				.withCondition(
					questionsHaveAnswers(
						[
							[questions.environmentalImpactSchedule, 'schedule-1'],
							[questions.environmentalImpactSchedule, 'no']
						],
						{ logicalCombinator: 'or' }
					)
				)
				.addQuestion(questions.uploadEnvironmentalStatement)
				.withCondition(questionHasAnswer(questions.submitEnvironmentalStatement, 'yes')),
			// Not yet decided whether this question is necessary
			// .addQuestion(questions.uploadScreeningDirection)
			// .withCondition(meetsCondition('screeningOpinionEnvironmentalStatement', 'yes')),
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
				.addQuestion(questions.statutoryConsultees)
				.addQuestion(questions.consultationResponses)
				.addQuestion(questions.consultationResponsesUpload)
				.withCondition(questionHasAnswer(questions.consultationResponses, 'yes'))
				.addQuestion(questions.representationsFromOthers)
				.addQuestion(questions.representationUpload)
				.withCondition(questionHasAnswer(questions.representationsFromOthers, 'yes')),
			new Section('Planning officer’s report and supporting documents', 'planning-officer-report')
				.addQuestion(questions.planningOfficersReportUpload)

				.addQuestion(questions.emergingPlan)
				.addQuestion(questions.emergingPlanUpload)
				.withCondition(questionHasAnswer(questions.emergingPlan, 'yes'))

				.addQuestion(questions.uploadOtherRelevantPolicies)

				.addQuestion(questions.supplementaryPlanning)
				.addQuestion(questions.supplementaryPlanningUpload)
				.withCondition(questionHasAnswer(questions.supplementaryPlanning, 'yes'))

				.addQuestion(questions.communityInfrastructureLevy)
				.addQuestion(questions.communityInfrastructureLevyUpload)
				.withCondition(questionHasAnswer(questions.communityInfrastructureLevy, 'yes'))
				.addQuestion(questions.communityInfrastructureLevyAdopted)
				.withCondition(questionHasAnswer(questions.communityInfrastructureLevy, 'yes'))
				.addQuestion(questions.communityInfrastructureLevyAdoptedDate)
				.withCondition(
					questionsHaveAnswers([
						[questions.communityInfrastructureLevy, 'yes'],
						[questions.communityInfrastructureLevyAdopted, 'yes']
					])
				)
				.addQuestion(questions.communityInfrastructureLevyAdoptDate)
				.withCondition(
					questionsHaveAnswers([
						[questions.communityInfrastructureLevy, 'yes'],
						[questions.communityInfrastructureLevyAdopted, 'no']
					])
				),
			new Section('Site access', 'site-access')
				.addQuestion(questions.accessForInspection)
				.addQuestion(questions.neighbouringSite)
				.addQuestion(questions.neighbouringSitesToBeVisited)
				.withCondition(questionHasAnswer(questions.neighbouringSite, 'yes'))
				.addQuestion(questions.potentialSafetyRisks),
			new Section('Appeal process', 'appeal-process')
				.addQuestion(questions.procedureType)
				.addQuestion(questions.whyInquiry)
				.withCondition(questionHasAnswer(questions.procedureType, 'inquiry'))
				.addQuestion(questions.whyHearing)
				.withCondition(questionHasAnswer(questions.procedureType, 'hearing'))
				.addQuestion(questions.appealsNearSite)
				.addQuestion(questions.nearbyAppeals)
				.withCondition(questionHasAnswer(questions.appealsNearSite, 'yes'))
				.addQuestion(questions.addNewConditions)
		);
	}
}

module.exports = { S78Journey, baseS78Url };
