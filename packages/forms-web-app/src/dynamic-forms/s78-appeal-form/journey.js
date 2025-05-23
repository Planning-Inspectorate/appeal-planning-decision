const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('../section');
const {
	questionHasAnswer,
	questionsHaveAnswers,
	questionHasNonEmptyStringAnswer,
	questionHasNonEmptyNumberAnswer
} = require('../dynamic-components/utils/question-has-answer');
const { APPEAL_CASE_PROCEDURE } = require('pins-data-model');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const {
	CASE_TYPES: { S78 }
} = require('@pins/common/src/database/data-static');
const config = require('../../config');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('../journey').Journey>[0], 'response'>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {boolean}
 */
const shouldDisplayIdentifyingLandowners = (response) => {
	if (questionHasAnswer(response, questions.ownsAllLand, 'yes')) return false;
	if (
		questionHasAnswer(response, questions.ownsSomeLand, 'yes') &&
		questionHasAnswer(response, questions.knowsWhoOwnsRestOfLand, 'yes')
	)
		return false;
	if (
		questionHasAnswer(response, questions.ownsSomeLand, 'no') &&
		questionHasAnswer(response, questions.knowsWhoOwnsLandInvolved, 'yes')
	)
		return false;

	return true;
};

/**
 * @param {JourneyResponse} response
 * @returns {boolean}
 */
const shouldDisplayTellingLandowners = (response) => {
	if (questionHasAnswer(response, questions.ownsAllLand, 'yes')) return false;

	if (
		questionsHaveAnswers(
			response,
			[
				[questions.ownsSomeLand, 'yes'],
				[questions.knowsWhoOwnsRestOfLand, 'no']
			],
			{ logicalCombinator: 'and' }
		) ||
		questionsHaveAnswers(
			response,
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
		questionHasAnswer(response, questions.agriculturalHolding, 'yes') &&
		(questionHasAnswer(response, questions.tenantAgriculturalHolding, 'no') ||
			questionsHaveAnswers(
				response,
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
		.withCondition((response) => questionHasAnswer(response, questions.applicationName, 'no'))
		.addQuestion(questions.contactDetails)
		.addQuestion(questions.contactPhoneNumber)
		.addQuestion(questions.appealSiteAddress)
		.addQuestion(questions.s78SiteArea)
		.addQuestion(questions.appellantGreenBelt)
		.addQuestion(questions.ownsAllLand)
		.addQuestion(questions.ownsSomeLand)
		.withCondition((response) => questionHasAnswer(response, questions.ownsAllLand, 'no'))
		.addQuestion(questions.knowsWhoOwnsRestOfLand)
		.withCondition((response) =>
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
		.withCondition((response) =>
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
			(response) =>
				shouldDisplayIdentifyingLandowners(response) &&
				questionHasAnswer(response, questions.ownsAllLand, 'no')
		)
		.addQuestion(questions.advertisingAppeal)
		.withCondition(
			(response) =>
				shouldDisplayIdentifyingLandowners(response) &&
				questionHasAnswer(response, questions.identifyingLandowners, 'yes')
		)
		.addQuestion(questions.tellingLandowners)
		.withCondition(
			(response) =>
				shouldDisplayTellingLandowners(response) &&
				questionHasAnswer(response, questions.ownsAllLand, 'no')
		)
		.addQuestion(questions.agriculturalHolding)
		.addQuestion(questions.tenantAgriculturalHolding)
		.withCondition((response) => questionHasAnswer(response, questions.agriculturalHolding, 'yes'))
		.addQuestion(questions.otherTenantsAgriculturalHolding)
		.withCondition((response) =>
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
		.withCondition(shouldDisplayTellingTenants)
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
		.withCondition((response) =>
			questionHasAnswer(
				response,
				questions.appellantProcedurePreference,
				APPEAL_CASE_PROCEDURE.HEARING
			)
		)
		.addQuestion(questions.appellantPreferInquiry)
		.withCondition((response) =>
			questionHasAnswer(
				response,
				questions.appellantProcedurePreference,
				APPEAL_CASE_PROCEDURE.INQUIRY
			)
		)
		.addQuestion(questions.inquiryHowManyDays)
		.withCondition(
			(response) =>
				questionHasAnswer(
					response,
					questions.appellantProcedurePreference,
					APPEAL_CASE_PROCEDURE.INQUIRY
				) && questionHasNonEmptyStringAnswer(response, questions.appellantPreferInquiry)
		)
		.addQuestion(questions.inquiryHowManyWitnesses)
		.withCondition(
			(response) =>
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
		.withCondition((response) => questionHasAnswer(response, questions.anyOtherAppeals, 'yes')),
	new Section('Upload documents', 'upload-documents')
		.addQuestion(questions.uploadOriginalApplicationForm)
		.addQuestion(questions.uploadChangeOfDescriptionEvidence)
		.withCondition((response) =>
			questionHasAnswer(response, questions.updateDevelopmentDescription, 'yes')
		)
		.addQuestion(questions.uploadApplicationDecisionLetter)
		.withCondition(shouldDisplayUploadDecisionLetter)
		.addQuestion(questions.submitPlanningObligation)
		.addQuestion(questions.planningObligationStatus)
		.withCondition((response) =>
			questionHasAnswer(response, questions.submitPlanningObligation, 'yes')
		)
		.addQuestion(questions.uploadPlanningObligation)
		.withCondition((response) =>
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
		.withCondition((response) =>
			questionHasAnswer(response, questions.separateOwnershipCert, 'yes')
		)
		.addQuestion(questions.uploadAppellantStatement)
		.addQuestion(questions.uploadStatementCommonGround)
		.withCondition((response) =>
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
		.withCondition((response) => questionHasAnswer(response, questions.costApplication, 'yes'))
		.addQuestion(questions.designAccessStatement)
		.addQuestion(questions.uploadDesignAccessStatement)
		.withCondition((response) =>
			questionHasAnswer(response, questions.designAccessStatement, 'yes')
		)
		.addQuestion(questions.uploadPlansDrawingsDocuments)
		.addQuestion(questions.newPlansDrawings)
		.addQuestion(questions.uploadNewPlansDrawings)
		.withCondition((response) => questionHasAnswer(response, questions.newPlansDrawings, 'yes'))
		.addQuestion(questions.otherNewDocuments)
		.addQuestion(questions.uploadOtherNewDocuments)
		.withCondition((response) => questionHasAnswer(response, questions.otherNewDocuments, 'yes'))
];

const baseS78SubmissionUrl = `/appeals/${S78.friendlyUrl}`;

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) => `${baseS78SubmissionUrl}?id=${response.referenceId}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.S78_APPEAL_FORM,
	sections,
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
