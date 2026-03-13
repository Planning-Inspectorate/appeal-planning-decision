const { getQuestions } = require('../questions');
const { Section } = require('@pins/dynamic-forms/src/section');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { APPEAL_CASE_PROCEDURE } = require('@planning-inspectorate/data-model');
const {
	CASE_TYPES: { CAS_ADVERTS, ADVERTS }
} = require('@pins/common/src/database/data-static');
const config = require('../../config');
const {
	questionHasAnswer,
	questionsHaveAnswers,
	questionHasNonEmptyStringAnswer,
	questionHasNonEmptyNumberAnswer
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
const {
	shouldDisplayIdentifyingLandowners,
	shouldDisplayTellingLandowners,
	shouldDisplayUploadDecisionLetter,
	shouldDisplayGridReference,
	shouldDisplayAdvertsQuestions
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
			.addQuestion(questions.highwayLand)
			.addQuestion(questions.advertInPosition)
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
			.withCondition(() => shouldDisplayIdentifyingLandowners(response, questions))
			.addQuestion(questions.advertisingAppeal)
			.withCondition(
				() =>
					shouldDisplayIdentifyingLandowners(response, questions) &&
					questionHasAnswer(response, questions.identifyingLandowners, 'yes')
			)
			.addQuestion(questions.tellingLandowners)
			.withCondition(() => shouldDisplayTellingLandowners(response, questions))
			.addQuestion(questions.landownerPermission)
			.withCondition(() => shouldDisplayTellingLandowners(response, questions))
			.addQuestion(questions.inspectorAccess)
			.addQuestion(questions.healthAndSafety)
			.addQuestion(questions.enterApplicationReference)
			.addQuestion(questions.planningApplicationDate)
			.addQuestion(questions.enterAdvertisementDescription)
			.addQuestion(questions.updateAdvertisementDescription)
			.addQuestion(questions.uploadChangeOfAdvertisementEvidence)
			.withCondition(() =>
				questionHasAnswer(response, questions.updateAdvertisementDescription, 'yes')
			)
			.addQuestion(questions.appellantProcedurePreference)
			.withCondition(() => shouldDisplayAdvertsQuestions(response))
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
			.addQuestion(questions.uploadApplicationDecisionLetter)
			.withCondition(() => shouldDisplayUploadDecisionLetter(response))
			.addQuestion(questions.uploadAppellantStatement)
			.addQuestion(questions.costApplication)
			.addQuestion(questions.uploadCostApplication)
			.withCondition(() => questionHasAnswer(response, questions.costApplication, 'yes'))
			.addQuestion(questions.uploadPlansDrawingsDocuments)
	];
};

const baseAdvertsSubmissionUrl = `/appeals/${CAS_ADVERTS.friendlyUrl}`;

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) => `${baseAdvertsSubmissionUrl}?id=${response.referenceId}`;

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBannerHtmlOverride = (response) => {
	const caseType = shouldDisplayAdvertsQuestions(response)
		? ADVERTS.processCode
		: CAS_ADVERTS.processCode;
	return `${config.betaBannerText}${config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(caseType))}`;
};

const advertsParams = {
	journeyId: JOURNEY_TYPES.ADVERTS_APPEAL_FORM.id,
	makeSections,
	taskListUrl: 'appeal-form/your-appeal',
	journeyTemplate: 'submission-form-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/submission',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Appeal a planning decision',
	returnToListing: true,
	makeBaseUrl,
	makeBannerHtmlOverride
};

module.exports = {
	...advertsParams,
	baseAdvertsSubmissionUrl
};
