const { questions } = require('../questions');
const { Section } = require('../section');
const {
	questionHasAnswerBuilder,
	questionsHaveAnswersBuilder,
	questionHasNonEmptyStringAnswer,
	questionHasNonEmptyNumberAnswer
} = require('../dynamic-components/utils/question-has-answer');
const { APPEAL_CASE_PROCEDURE } = require('pins-data-model');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {ConstructorParameters<typeof import('../journey').Journey>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {boolean}
 */
const shouldDisplayIdentifyingLandowners = (response) => {
	if (questionHasAnswerBuilder(response)(questions.ownsAllLand, 'yes')) return false;
	if (
		questionHasAnswerBuilder(response)(questions.ownsSomeLand, 'yes') &&
		questionHasAnswerBuilder(response)(questions.knowsWhoOwnsRestOfLand, 'yes')
	)
		return false;
	if (
		questionHasAnswerBuilder(response)(questions.ownsSomeLand, 'no') &&
		questionHasAnswerBuilder(response)(questions.knowsWhoOwnsLandInvolved, 'yes')
	)
		return false;

	return true;
};

/**
 * @param {JourneyResponse} response
 * @returns {boolean}
 */
const shouldDisplayTellingLandowners = (response) => {
	if (questionHasAnswerBuilder(response)(questions.ownsAllLand, 'yes')) return false;

	if (
		questionsHaveAnswersBuilder(response)(
			[
				[questions.ownsSomeLand, 'yes'],
				[questions.knowsWhoOwnsRestOfLand, 'no']
			],
			{ logicalCombinator: 'and' }
		) ||
		questionsHaveAnswersBuilder(response)(
			[
				[questions.ownsSomeLand, 'no'],
				[questions.knowsWhoOwnsLandInvolved, 'no']
			],
			{ logicalCombinator: 'and' }
		)
	)
		return false;

	return true;
};

/**
 * @param {JourneyResponse} response
 * @returns {boolean}
 */
const shouldDisplayTellingTenants = (response) => {
	if (
		questionHasAnswerBuilder(response)(questions.agriculturalHolding, 'yes') &&
		(questionHasAnswerBuilder(response)(questions.tenantAgriculturalHolding, 'no') ||
			questionsHaveAnswersBuilder(response)(
				[
					[questions.tenantAgriculturalHolding, 'yes'],
					[questions.otherTenantsAgriculturalHolding, 'yes']
				],
				{ logicalCombinator: 'and' }
			))
	)
		return true;

	return false;
};

/**
 * @param {JourneyResponse} response
 * @returns {boolean}
 */
const shouldDisplayUploadDecisionLetter = (response) => {
	return response.answers.applicationDecision !== 'nodecisionreceived';
};

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const sections = [
	new Section('Prepare appeal', 'prepare-appeal')
		.addQuestion(questions.applicationName)
		.addQuestion(questions.applicantName)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.applicationName, 'no')
		)
		.addQuestion(questions.contactDetails)
		.addQuestion(questions.contactPhoneNumber)
		.addQuestion(questions.appealSiteAddress)
		.addQuestion(questions.s78SiteArea)
		.addQuestion(questions.appellantGreenBelt)
		.addQuestion(questions.ownsAllLand)
		.addQuestion(questions.ownsSomeLand)
		.withCondition((response) => questionHasAnswerBuilder(response)(questions.ownsAllLand, 'no'))
		.addQuestion(questions.knowsWhoOwnsRestOfLand)
		.withCondition((response) =>
			questionsHaveAnswersBuilder(response)(
				[
					[questions.ownsSomeLand, 'yes'],
					[questions.ownsAllLand, 'no']
				],
				{ logicalCombinator: 'and' }
			)
		)
		.addQuestion(questions.knowsWhoOwnsLandInvolved)
		.withCondition((response) =>
			questionsHaveAnswersBuilder(response)(
				[
					[questions.ownsSomeLand, 'no'],
					[questions.ownsAllLand, 'no']
				],
				{ logicalCombinator: 'and' }
			)
		)
		.addQuestion(questions.identifyingLandowners)
		.withCondition(
			(response) =>
				shouldDisplayIdentifyingLandowners(response) &&
				questionHasAnswerBuilder(response)(questions.ownsAllLand, 'no')
		)
		.addQuestion(questions.advertisingAppeal)
		.withCondition(
			(response) =>
				shouldDisplayIdentifyingLandowners(response) &&
				questionHasAnswerBuilder(response)(questions.identifyingLandowners, 'yes')
		)
		.addQuestion(questions.tellingLandowners)
		.withCondition(
			(response) =>
				shouldDisplayTellingLandowners(response) &&
				questionHasAnswerBuilder(response)(questions.ownsAllLand, 'no')
		)
		.addQuestion(questions.agriculturalHolding)
		.addQuestion(questions.tenantAgriculturalHolding)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.agriculturalHolding, 'yes')
		)
		.addQuestion(questions.otherTenantsAgriculturalHolding)
		.withCondition((response) =>
			questionsHaveAnswersBuilder(response)(
				[
					[questions.agriculturalHolding, 'yes'],
					[questions.tenantAgriculturalHolding, 'yes']
				],
				{ logicalCombinator: 'and' }
			)
		)
		.addQuestion(questions.informedTenantsAgriculturalHolding)
		.withCondition(shouldDisplayTellingTenants)
		.addQuestion(questions.inspectorAccess)
		.addQuestion(questions.healthAndSafety)
		.addQuestion(questions.enterApplicationReference)
		.addQuestion(questions.planningApplicationDate())
		.addQuestion(questions.enterDevelopmentDescription)
		.addQuestion(questions.updateDevelopmentDescription)
		.addQuestion(questions.appellantProcedurePreference)
		.addQuestion(questions.appellantPreferHearing)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(
				questions.appellantProcedurePreference,
				APPEAL_CASE_PROCEDURE.HEARING
			)
		)
		.addQuestion(questions.appellantPreferInquiry)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(
				questions.appellantProcedurePreference,
				APPEAL_CASE_PROCEDURE.INQUIRY
			)
		)
		.addQuestion(questions.inquiryHowManyDays)
		.withCondition(
			(response) =>
				questionHasAnswerBuilder(response)(
					questions.appellantProcedurePreference,
					APPEAL_CASE_PROCEDURE.INQUIRY
				) && questionHasNonEmptyStringAnswer(response)(questions.appellantPreferInquiry)
		)
		.addQuestion(questions.inquiryHowManyWitnesses)
		.withCondition(
			(response) =>
				questionHasAnswerBuilder(response)(
					questions.appellantProcedurePreference,
					APPEAL_CASE_PROCEDURE.INQUIRY
				) &&
				questionHasNonEmptyStringAnswer(response)(questions.appellantPreferInquiry) &&
				questionHasNonEmptyNumberAnswer(response)(questions.inquiryHowManyDays)
		)
		.addQuestion(questions.anyOtherAppeals)
		.addQuestion(questions.linkAppeals)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.anyOtherAppeals, 'yes')
		),
	new Section('Upload documents', 'upload-documents')
		.addQuestion(questions.uploadOriginalApplicationForm)
		.addQuestion(questions.uploadChangeOfDescriptionEvidence)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.updateDevelopmentDescription, 'yes')
		)
		.addQuestion(questions.uploadApplicationDecisionLetter)
		.withCondition(shouldDisplayUploadDecisionLetter)
		.addQuestion(questions.submitPlanningObligation)
		.addQuestion(questions.planningObligationStatus)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.submitPlanningObligation, 'yes')
		)
		.addQuestion(questions.uploadPlanningObligation)
		.withCondition((response) =>
			questionsHaveAnswersBuilder(response)(
				[
					[questions.submitPlanningObligation, 'yes'],
					[questions.planningObligationStatus, 'finalised']
				],
				{ logicalCombinator: 'and' }
			)
		)
		.addQuestion(questions.separateOwnershipCert)
		.addQuestion(questions.uploadSeparateOwnershipCert)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.separateOwnershipCert, 'yes')
		)
		.addQuestion(questions.uploadAppellantStatement)
		.addQuestion(questions.uploadStatementCommonGround)
		.withCondition((response) =>
			questionsHaveAnswersBuilder(response)(
				[
					[questions.appellantProcedurePreference, APPEAL_CASE_PROCEDURE.HEARING],
					[questions.appellantProcedurePreference, APPEAL_CASE_PROCEDURE.INQUIRY]
				],
				{ logicalCombinator: 'or' }
			)
		)
		.addQuestion(questions.costApplication)
		.addQuestion(questions.uploadCostApplication)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.costApplication, 'yes')
		)
		.addQuestion(questions.designAccessStatement)
		.addQuestion(questions.uploadDesignAccessStatement)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.designAccessStatement, 'yes')
		)
		.addQuestion(questions.uploadPlansDrawingsDocuments)
		.addQuestion(questions.newPlansDrawings)
		.addQuestion(questions.uploadNewPlansDrawings)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.newPlansDrawings, 'yes')
		)
		.addQuestion(questions.otherNewDocuments)
		.addQuestion(questions.uploadOtherNewDocuments)
		.withCondition((response) =>
			questionHasAnswerBuilder(response)(questions.otherNewDocuments, 'yes')
		)
];

const fixedParams = {
	sections,
	baseS78SubmissionUrl: '/appeals/full-planning',
	taskListUrl: 'appeal-form/your-appeal',
	journeyTemplate: 'submission-form-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/submission',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Appeal a planning decision',
	returnToListing: true
};

/**
 * @param {JourneyResponse} response
 * @returns {JourneyParameters}
 */
const buildJourneyParams = (response) => [
	{
		...fixedParams,
		response,
		baseUrl: `${fixedParams.baseS78SubmissionUrl}?id=${response.referenceId}`
	}
];

module.exports = { buildJourneyParams, ...fixedParams };
