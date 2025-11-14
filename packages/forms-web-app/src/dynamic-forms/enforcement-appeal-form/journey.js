const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('@pins/dynamic-forms/src/section');
const {
	questionHasAnswer,
	questionsHaveAnswers,
	questionHasNonEmptyStringAnswer
	// questionHasNonEmptyStringAnswer,
	// questionHasNonEmptyNumberAnswer
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
// const { APPEAL_CASE_PROCEDURE } = require('@planning-inspectorate/data-model');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const {
	CASE_TYPES: { ENFORCEMENT }
} = require('@pins/common/src/database/data-static');
const config = require('../../config');
const { fieldValues } = require('@pins/common/src/dynamic-forms/field-values');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('@pins/dynamic-forms/src/journey').Journey>[0], 'response'>} JourneyParameters
 */

const escape = require('escape-html');
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
	const individuals = response.answers['SubmissionIndividual'] || [''];

	if (!individuals.length) {
		return 'Named Individual';
	}

	const finalNamedIndividual = individuals.pop();

	const formatIndividual = (individual) => {
		const firstName = individual.firstName || 'Named';
		const lastName = individual.lastName || 'Individual';
		return escape(`${firstName} ${lastName}`);
	};

	const formattedStringPartOne = individuals.map(formatIndividual).join(', ');

	return [formattedStringPartOne, formatIndividual(finalNamedIndividual)].join(' and ');
};

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const formatDynamicNames = (response) => {
	const party = response.answers['enforcementWhoIsAppealing'];

	switch (party) {
		case fieldValues.enforcementWhoIsAppealing.ORGANISATION:
			return response.answers['enforcementOrganisationName'];
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
const makeSections = (response) => [
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
		.addQuestion(questions.enforcementOrganisationName)
		.withCondition(() =>
			questionHasAnswer(
				response,
				questions.enforcementWhoIsAppealing,
				fieldValues.enforcementWhoIsAppealing.ORGANISATION
			)
		)
		.addQuestion(questions.contactDetails)
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
		.addQuestion(questions.enforcementInspectorAccess)
		.addQuestion(questions.healthAndSafety),
	new Section('Upload documents', 'upload-documents')
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
