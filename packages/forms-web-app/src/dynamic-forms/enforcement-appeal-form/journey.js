const { getQuestions } = require('../questions');
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
	CASE_TYPES: { ENFORCEMENT }
} = require('@pins/common/src/database/data-static');
const config = require('../../config');
const {
	shouldDisplayUploadDecisionLetter,
	shouldDisplayPreviousApplicationQuestions,
	shouldDisplayPriorCorrespondenceUpload,
	shouldDisplayEnforcementContactDetails,
	shouldDisplayEnforcementCompleteOnBehalfOf
} = require('../display-questions');
const { fieldValues } = require('@pins/common/src/dynamic-forms/field-values');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('@pins/dynamic-forms/src/journey').Journey>[0], 'response'>} JourneyParameters
 */

const escape = require('escape-html');
const {
	getAppealGroundsQuestions,
	chooseGroundsOfAppealQuestion
} = require('../appeal-grounds-questions');
const { generateInterestInLandQuestionsAndConditions } = require('../enforcement-questions');
/** @type {Array<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'>} */
const appealGroundsArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const formatEnforcementIndividualName = (response) => {
	const firstName = response.answers['appellantFirstName'] || 'Named';
	const lastName = response.answers['appellantLastName'] || 'Individual';

	return escape(`${firstName} ${lastName}`);
};

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const formatGroupOfIndividuals = (response) => {
	const baseIndividuals = response.answers['SubmissionIndividual'] || [];

	const individuals = Array.isArray(baseIndividuals) ? [...baseIndividuals] : [baseIndividuals];

	if (!individuals.length) {
		return 'Named Individual';
	}

	const finalNamedIndividual = individuals.slice(-1)[0];
	const allButFinalIndividuals = individuals.slice(0, -1);

	/**
	 * @param {import('appeals-service-api').Api.SubmissionIndividual} individual
	 * @return {string}
	 */
	const formatIndividual = (individual) => {
		const firstName = individual.firstName || 'Named';
		const lastName = individual.lastName || 'Individual';
		return escape(`${firstName} ${lastName}`);
	};

	const formattedStringPartOne = allButFinalIndividuals.map(formatIndividual).join(', ');

	return [formattedStringPartOne, formatIndividual(finalNamedIndividual)].join(' and ');
};

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const formatDynamicNames = (response) => {
	const party = response.answers['enforcementWhoIsAppealing'];

	if (!party) return 'Named Individual';

	switch (party) {
		case fieldValues.enforcementWhoIsAppealing.ORGANISATION:
			/** @ts-ignore */
			return response.answers['enforcementOrganisationName'] || 'Named Company';
		case fieldValues.enforcementWhoIsAppealing.GROUP:
			return formatGroupOfIndividuals(response);
		default:
			return formatEnforcementIndividualName(response);
	}
};

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const makeSections = (response) => {
	const questions = getQuestions(response);
	const appealGroundsQuestions = getAppealGroundsQuestions(response, appealGroundsArray);
	const interestInLandQuestions = generateInterestInLandQuestionsAndConditions(response);

	return [
		new Section('Prepare appeal', 'prepare-appeal')
			.addQuestion(questions.enforcementWhoIsAppealing)
			.startMultiQuestionCondition('individual appellant', () =>
				questionHasAnswer(
					response,
					questions.enforcementWhoIsAppealing,
					fieldValues.enforcementWhoIsAppealing.INDIVIDUAL
				)
			)
			.addQuestion(questions.enforcementIndividualName)
			.addQuestion(questions.enforcementAreYouIndividual)
			.withCondition(() =>
				questionHasNonEmptyStringAnswer(response, { fieldName: 'appellantFirstName' })
			)
			.withVariables({
				[QUESTION_VARIABLES.INDIVIDUAL_NAME]: formatEnforcementIndividualName(response)
			})
			.endMultiQuestionCondition('individual appellant')
			.startMultiQuestionCondition('group of appellants', () =>
				questionHasAnswer(
					response,
					questions.enforcementWhoIsAppealing,
					fieldValues.enforcementWhoIsAppealing.GROUP
				)
			)
			.addQuestion(questions.enforcementAddNamedIndividuals)
			.addQuestion(questions.enforcementSelectYourName)
			.endMultiQuestionCondition('group of appellants')
			.addQuestion(questions.enforcementOrganisationName)
			.withCondition(() =>
				questionHasAnswer(
					response,
					questions.enforcementWhoIsAppealing,
					fieldValues.enforcementWhoIsAppealing.ORGANISATION
				)
			)
			// question will appear if user is not the appellant (will also appear if filling out on behalf of a company)
			.addQuestion(questions.contactDetails)
			.withCondition(() => shouldDisplayEnforcementContactDetails(response, questions))
			.addQuestion(questions.contactPhoneNumber)
			.addQuestion(questions.completeOnBehalfOf)
			.withCondition(() => shouldDisplayEnforcementCompleteOnBehalfOf(response, questions))
			.withVariables({
				[QUESTION_VARIABLES.DYNAMIC_NAMED_PARTIES]: formatDynamicNames(response)
			})
			// consider whether to make dynamic to generate hint...
			.addQuestion(questions.appealSiteAddress)
			.addQuestion(questions.appealSiteIsContactAddress)
			.addQuestion(questions.contactAddress)
			.withCondition(() => questionHasAnswer(response, questions.appealSiteIsContactAddress, 'no'))
			.addQuestions(interestInLandQuestions)
			.addQuestion(questions.enforcementInspectorAccess)
			.addQuestion(questions.healthAndSafety)
			.addQuestion(questions.enterAllegedBreachDescription)
			.addQuestion(chooseGroundsOfAppealQuestion)
			.startMultiQuestionCondition(
				'groundAPreviousApplication',
				shouldDisplayPreviousApplicationQuestions
			)
			.addQuestion(questions.submittedPlanningApplication)
			.addQuestion(questions.allOrPartOfDevelopment)
			.addQuestion(questions.planningApplicationReference)
			.addQuestion(questions.planningApplicationDate)
			.addQuestion(questions.enforcementEnterDevelopmentDescription)
			.addQuestion(questions.updateDevelopmentDescription)
			.addQuestion(questions.grantedOrRefused)
			.addQuestion(questions.applicationDecisionDate)
			.withCondition(
				() =>
					questionHasAnswer(response, questions.grantedOrRefused, 'granted') ||
					questionHasAnswer(response, questions.grantedOrRefused, 'refused')
			)
			.addQuestion(questions.applicationDecisionAppealed)
			.withCondition(
				() =>
					questionHasAnswer(response, questions.grantedOrRefused, 'granted') ||
					questionHasAnswer(response, questions.grantedOrRefused, 'refused')
			)
			.addQuestion(questions.appealDecisionDate)
			.withCondition(() =>
				questionHasAnswer(response, questions.applicationDecisionAppealed, 'yes')
			)
			.addQuestion(questions.applicationDecisionDueDate)
			.withCondition(() =>
				questionHasAnswer(response, questions.grantedOrRefused, 'nodecisionreceived')
			)
			.endMultiQuestionCondition('groundAPreviousApplication')
			.addQuestions(appealGroundsQuestions)
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
			.addQuestion(questions.uploadPriorCorrespondence)
			.withCondition(() => shouldDisplayPriorCorrespondenceUpload(response))
			.addQuestion(questions.uploadEnforcementNotice)
			.addQuestion(questions.uploadEnforcementNoticePlan)
			.addQuestion(questions.uploadOriginalApplicationForm)
			.withCondition(() =>
				questionHasAnswer(response, questions.submittedPlanningApplication, 'yes')
			)
			.addQuestion(questions.uploadChangeOfDescriptionEvidence)
			.withCondition(() =>
				questionHasAnswer(response, questions.updateDevelopmentDescription, 'yes')
			)
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
			.addQuestion(questions.costApplication)
			.addQuestion(questions.uploadCostApplication)
			.withCondition(() => questionHasAnswer(response, questions.costApplication, 'yes'))
			.addQuestion(questions.otherNewDocuments)
			.addQuestion(questions.uploadOtherNewDocuments)
			.withCondition(() => questionHasAnswer(response, questions.otherNewDocuments, 'yes'))
	];
};

const baseEnforcementSubmissionUrl = `/appeals/${ENFORCEMENT.friendlyUrl}`;

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) => `${baseEnforcementSubmissionUrl}?id=${response.referenceId}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.ENFORCEMENT_APPEAL_FORM.id,
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
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(ENFORCEMENT.processCode))
};

module.exports = { ...params, baseEnforcementSubmissionUrl };
