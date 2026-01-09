const { getQuestions } = require('../questions');
const { Section } = require('@pins/dynamic-forms/src/section');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { APPEAL_CASE_PROCEDURE } = require('@planning-inspectorate/data-model');
const {
	CASE_TYPES: { LDC }
} = require('@pins/common/src/database/data-static');
const config = require('../../config');
const {
	questionHasAnswer,
	questionHasNonEmptyStringAnswer,
	questionHasNonEmptyNumberAnswer,
	questionsHaveAnswers
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
const {
	shouldDisplayUploadDecisionLetter,
	shouldDisplayGridReference
} = require('../display-questions');

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
		new Section('Prepare appeal', 'prepare-appeal')
			.addQuestion(questions.applicationName)
			.addQuestion(questions.applicantName)
			.withCondition(() => questionHasAnswer(response, questions.applicationName, 'no'))
			.addQuestion(questions.contactDetails)
			.addQuestion(questions.contactPhoneNumber)
			.addQuestion(questions.appealSiteAddress)
			.withCondition(() => !shouldDisplayGridReference(response, config))
			.addQuestion(questions.appealSiteGridReference)
			.withCondition(() => shouldDisplayGridReference(response, config))
			.addQuestion(questions.appellantGreenBelt)
			.addQuestion(questions.inspectorAccess)
			.addQuestion(questions.healthAndSafety)
			.addQuestion(questions.enterApplicationReference)
			.addQuestion(questions.planningApplicationDate)
			.addQuestion(questions.enterDevelopmentDescription) // todo: condition - ldc about, new question
			.addQuestion(questions.updateDevelopmentDescription) // todo: condition - ldc about, new question
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
			.withCondition(() =>
				questionHasAnswer(response, questions.updateDevelopmentDescription, 'yes')
			)
			.addQuestion(questions.uploadApplicationDecisionLetter)
			.withCondition(() => shouldDisplayUploadDecisionLetter(response))
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
			.addQuestion(questions.uploadPlansDrawingsDocuments)
			.addQuestion(questions.newPlansDrawings)
			.addQuestion(questions.uploadNewPlansDrawings)
			.withCondition(() => questionHasAnswer(response, questions.newPlansDrawings, 'yes'))
			.addQuestion(questions.otherNewDocuments)
			.addQuestion(questions.uploadOtherNewDocuments)
			.withCondition(() => questionHasAnswer(response, questions.otherNewDocuments, 'yes'))
	];
};

const baseLdcSubmissionUrl = `/appeals/${LDC.friendlyUrl}`;

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) => `${baseLdcSubmissionUrl}?id=${response.referenceId}`;

const ldcParams = {
	journeyId: JOURNEY_TYPES.LDC_APPEAL_FORM.id,
	makeSections,
	taskListUrl: 'appeal-form/your-appeal',
	journeyTemplate: 'submission-form-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/submission',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Appeal a planning decision',
	returnToListing: true,
	makeBaseUrl,
	makeBannerHtmlOverride: () =>
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(LDC.processCode))
};

module.exports = {
	...ldcParams,
	baseLdcSubmissionUrl
};
