const { getQuestions } = require('../questions');
const { Section } = require('@pins/dynamic-forms/src/section');
const {
	questionHasAnswer,
	questionHasNonEmptyStringAnswer,
	questionHasNonEmptyNumberAnswer
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
const { APPEAL_CASE_PROCEDURE } = require('@planning-inspectorate/data-model');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const {
	CASE_TYPES: { ENFORCEMENT_LISTED }
} = require('@pins/common/src/database/data-static');
const config = require('../../config');
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
/** @type {Array<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k'>} */
const appealGroundsArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];

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

// /**
//  * @param {JourneyResponse} response
//  * @returns {string}
//  */
// const formatInterestInLandNames = (response) => {
// 	const party = response.answers['enforcementWhoIsAppealing'];

// 	if (!party) return "Named Individual's";

// 	if (response.answers['isAppellant'] === 'yes') return 'your';

// 	let partyName;
// 	if (party === fieldValues.enforcementWhoIsAppealing.ORGANISATION) {
// 		/** @ts-ignore */
// 		partyName = escape(response.answers['enforcementOrganisationName'] || 'Named Company');
// 	} else {
// 		partyName = formatEnforcementIndividualName(response);
// 	}

// 	return `${partyName}'s`;
// };

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
			.addQuestion(questions.enforcementIndividualName)
			.withCondition(() =>
				questionHasAnswer(
					response,
					questions.enforcementWhoIsAppealing,
					fieldValues.enforcementWhoIsAppealing.INDIVIDUAL
				)
			)
			.addQuestion(questions.enforcementAreYouIndividual)
			.withCondition(() =>
				questionHasAnswer(
					response,
					questions.enforcementWhoIsAppealing,
					fieldValues.enforcementWhoIsAppealing.INDIVIDUAL
				)
			)
			.withVariables({
				[QUESTION_VARIABLES.INDIVIDUAL_NAME]: formatEnforcementIndividualName(response)
			})
			.addQuestion(questions.enforcementAddNamedIndividuals)
			.withCondition(() =>
				questionHasAnswer(
					response,
					questions.enforcementWhoIsAppealing,
					fieldValues.enforcementWhoIsAppealing.GROUP
				)
			)
			.addQuestion(questions.enforcementSelectYourName)
			.withCondition(() =>
				questionHasAnswer(
					response,
					questions.enforcementWhoIsAppealing,
					fieldValues.enforcementWhoIsAppealing.GROUP
				)
			)
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
			.withCondition(
				() => !questionHasAnswer(response, questions.enforcementAreYouIndividual, 'yes')
			)
			.addQuestion(questions.contactPhoneNumber)
			.addQuestion(questions.completeOnBehalfOf)
			.withCondition(() =>
				questionHasNonEmptyStringAnswer(response, questions.enforcementWhoIsAppealing)
			)
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
			.addQuestion(questions.uploadEnforcementNotice)
			.addQuestion(questions.uploadEnforcementNoticePlan)
			.addQuestion(questions.costApplication)
			.addQuestion(questions.uploadCostApplication)
			.withCondition(() => questionHasAnswer(response, questions.costApplication, 'yes'))
			.addQuestion(questions.otherNewDocuments)
			.addQuestion(questions.uploadOtherNewDocuments)
			.withCondition(() => questionHasAnswer(response, questions.otherNewDocuments, 'yes'))
	];
};

const baseEnforcementListedSubmissionUrl = `/appeals/${ENFORCEMENT_LISTED.friendlyUrl}`;

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseEnforcementListedSubmissionUrl}?id=${response.referenceId}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.ENFORCEMENT_LISTED_APPEAL_FORM.id,
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
		config.generateBetaBannerFeedbackLink(
			config.getAppealTypeFeedbackUrl(ENFORCEMENT_LISTED.processCode)
		)
};

module.exports = { ...params, baseEnforcementListedSubmissionUrl };
