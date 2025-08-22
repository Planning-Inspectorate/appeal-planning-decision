const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('@pins/dynamic-forms/src/section');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const {
	CASE_TYPES: { CAS_ADVERTS }
} = require('@pins/common/src/database/data-static');
const config = require('../../config');
const {
	questionHasAnswer,
	questionsHaveAnswers
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
const {
	shouldDisplayIdentifyingLandowners,
	shouldDisplayTellingLandowners,
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
		// grid reference question placeholder
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

const baseAdvertsSubmissionUrl = `/appeals/${CAS_ADVERTS.friendlyUrl}`;

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) => `${baseAdvertsSubmissionUrl}?id=${response.referenceId}`;

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
	bannerHtmlOverride:
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(CAS_ADVERTS.processCode))
};

module.exports = {
	...advertsParams,
	baseAdvertsSubmissionUrl
};
