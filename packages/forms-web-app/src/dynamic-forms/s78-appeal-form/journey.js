const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('@pins/dynamic-forms/src/section');
const {
	questionHasAnswer,
	questionsHaveAnswers,
	questionHasNonEmptyStringAnswer,
	questionHasNonEmptyNumberAnswer
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
const { APPEAL_CASE_PROCEDURE } = require('@planning-inspectorate/data-model');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const {
	CASE_TYPES: { S78 }
} = require('@pins/common/src/database/data-static');
const config = require('../../config');
const {
	shouldDisplayIdentifyingLandowners,
	shouldDisplayTellingLandowners,
	shouldDisplayTellingTenants,
	shouldDisplayUploadDecisionLetter
} = require('../display-questions');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('@pins/dynamic-forms/src/journey').Journey>[0], 'response'>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const makeSections = (response) => [
	new Section('Prepare appeal', 'prepare-appeal')
		.addQuestion(questions.applicationName)
		.addQuestion(questions.applicantName)
		.withCondition(() => questionHasAnswer(response, questions.applicationName, 'no'))
		.addQuestion(questions.contactDetails)
		.addQuestion(questions.contactPhoneNumber)
		.addQuestion(questions.appealSiteAddress)
		.addQuestion(questions.s78SiteArea)
		.addQuestion(questions.appellantGreenBelt)
		.addQuestion(questions.ownsAllLand)
		.addQuestion(questions.ownsSomeLand)
		.withCondition(() => questionHasAnswer(response, questions.ownsAllLand, 'no'))
		.addQuestion(questions.knowsWhoOwnsRestOfLand)
		.withCondition(() =>
			questionsHaveAnswers(
				response,
				[
					[questions.ownsSomeLand, 'yes'],
					[questions.ownsAllLand, 'no']
				],
				{ logicalCombinator: 'and' }
			)
		)
		.addQuestion(questions.knowsWhoOwnsLandInvolved)
		.withCondition(() =>
			questionsHaveAnswers(
				response,
				[
					[questions.ownsSomeLand, 'no'],
					[questions.ownsAllLand, 'no']
				],
				{ logicalCombinator: 'and' }
			)
		)
		.addQuestion(questions.identifyingLandowners)
		.withCondition(
			() =>
				shouldDisplayIdentifyingLandowners(response, questions) &&
				questionHasAnswer(response, questions.ownsAllLand, 'no')
		)
		.addQuestion(questions.advertisingAppeal)
		.withCondition(
			() =>
				shouldDisplayIdentifyingLandowners(response, questions) &&
				questionHasAnswer(response, questions.identifyingLandowners, 'yes')
		)
		.addQuestion(questions.tellingLandowners)
		.withCondition(
			() =>
				shouldDisplayTellingLandowners(response, questions) &&
				questionHasAnswer(response, questions.ownsAllLand, 'no')
		)
		.addQuestion(questions.agriculturalHolding)
		.addQuestion(questions.tenantAgriculturalHolding)
		.withCondition(() => questionHasAnswer(response, questions.agriculturalHolding, 'yes'))
		.addQuestion(questions.otherTenantsAgriculturalHolding)
		.withCondition(() =>
			questionsHaveAnswers(
				response,
				[
					[questions.agriculturalHolding, 'yes'],
					[questions.tenantAgriculturalHolding, 'yes']
				],
				{ logicalCombinator: 'and' }
			)
		)
		.addQuestion(questions.informedTenantsAgriculturalHolding)
		.withCondition(() => shouldDisplayTellingTenants(response, questions))
		.addQuestion(questions.inspectorAccess)
		.addQuestion(questions.healthAndSafety)
		.addQuestion(questions.enterApplicationReference)
		.addQuestion(questions.planningApplicationDate)
		.addQuestion(questions.majorMinorDevelopment)
		.addQuestion(questions.developmentType)
		.addQuestion(questions.enterDevelopmentDescription)
		.addQuestion(questions.updateDevelopmentDescription)
		.addQuestion(questions.appellantProcedurePreference)
		.addQuestion(questions.appellantPreferHearing)
		.withCondition(() =>
			questionHasAnswer(
				response,
				questions.appellantProcedurePreference,
				APPEAL_CASE_PROCEDURE.HEARING
			)
		)
		.addQuestion(questions.appellantPreferInquiry)
		.withCondition(() =>
			questionHasAnswer(
				response,
				questions.appellantProcedurePreference,
				APPEAL_CASE_PROCEDURE.INQUIRY
			)
		)
		.addQuestion(questions.inquiryHowManyDays)
		.withCondition(
			() =>
				questionHasAnswer(
					response,
					questions.appellantProcedurePreference,
					APPEAL_CASE_PROCEDURE.INQUIRY
				) && questionHasNonEmptyStringAnswer(response, questions.appellantPreferInquiry)
		)
		.addQuestion(questions.inquiryHowManyWitnesses)
		.withCondition(
			() =>
				questionHasAnswer(
					response,
					questions.appellantProcedurePreference,
					APPEAL_CASE_PROCEDURE.INQUIRY
				) &&
				questionHasNonEmptyStringAnswer(response, questions.appellantPreferInquiry) &&
				questionHasNonEmptyNumberAnswer(response, questions.inquiryHowManyDays)
		)
		.addQuestion(questions.anyOtherAppeals)
		.addQuestion(questions.linkAppeals)
		.withCondition(() => questionHasAnswer(response, questions.anyOtherAppeals, 'yes')),
	new Section('Upload documents', 'upload-documents')
		.addQuestion(questions.uploadOriginalApplicationForm)
		.addQuestion(questions.uploadChangeOfDescriptionEvidence)
		.withCondition(() => questionHasAnswer(response, questions.updateDevelopmentDescription, 'yes'))
		.addQuestion(questions.uploadApplicationDecisionLetter)
		.withCondition(shouldDisplayUploadDecisionLetter)
		.addQuestion(questions.submitPlanningObligation)
		.addQuestion(questions.planningObligationStatus)
		.withCondition(() => questionHasAnswer(response, questions.submitPlanningObligation, 'yes'))
		.addQuestion(questions.uploadPlanningObligation)
		.withCondition(() =>
			questionsHaveAnswers(
				response,
				[
					[questions.submitPlanningObligation, 'yes'],
					[questions.planningObligationStatus, 'finalised']
				],
				{ logicalCombinator: 'and' }
			)
		)
		.addQuestion(questions.separateOwnershipCert)
		.addQuestion(questions.uploadSeparateOwnershipCert)
		.withCondition(() => questionHasAnswer(response, questions.separateOwnershipCert, 'yes'))
		.addQuestion(questions.uploadAppellantStatement)
		.addQuestion(questions.uploadStatementCommonGround)
		.withCondition(() =>
			questionsHaveAnswers(
				response,
				[
					[questions.appellantProcedurePreference, APPEAL_CASE_PROCEDURE.HEARING],
					[questions.appellantProcedurePreference, APPEAL_CASE_PROCEDURE.INQUIRY]
				],
				{ logicalCombinator: 'or' }
			)
		)
		.addQuestion(questions.costApplication)
		.addQuestion(questions.uploadCostApplication)
		.withCondition(() => questionHasAnswer(response, questions.costApplication, 'yes'))
		.addQuestion(questions.designAccessStatement)
		.addQuestion(questions.uploadDesignAccessStatement)
		.withCondition(() => questionHasAnswer(response, questions.designAccessStatement, 'yes'))
		.addQuestion(questions.uploadPlansDrawingsDocuments)
		.addQuestion(questions.newPlansDrawings)
		.addQuestion(questions.uploadNewPlansDrawings)
		.withCondition(() => questionHasAnswer(response, questions.newPlansDrawings, 'yes'))
		.addQuestion(questions.otherNewDocuments)
		.addQuestion(questions.uploadOtherNewDocuments)
		.withCondition(() => questionHasAnswer(response, questions.otherNewDocuments, 'yes'))
];

const baseS78SubmissionUrl = `/appeals/${S78.friendlyUrl}`;

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) => `${baseS78SubmissionUrl}?id=${response.referenceId}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.S78_APPEAL_FORM.id,
	makeSections,
	taskListUrl: 'appeal-form/your-appeal',
	journeyTemplate: 'submission-form-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/submission',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Appeal a planning decision',
	returnToListing: true,
	makeBaseUrl,
	bannerHtmlOverride:
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(S78.processCode))
};

module.exports = { ...params, baseS78SubmissionUrl };
