const { getQuestions } = require('../questions');
const { Section } = require('@pins/dynamic-forms/src/section');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');
const {
	CASE_TYPES: { LDC }
} = require('@pins/common/src/database/data-static');
const {
	mapAppealTypeToDisplayText,
	mapAppealTypeToDisplayTextWithAnOrA
} = require('@pins/common/src/appeal-type-to-display-text');
const {
	questionHasAnswer
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');

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
		new Section('Constraints, designations and other issues', 'constraints')
			.addQuestion(questions.appealTypeAppropriate)
			.withVariables({
				[QUESTION_VARIABLES.APPEAL_TYPE_WITH_AN_OR_A]: mapAppealTypeToDisplayTextWithAnOrA(LDC),
				[QUESTION_VARIABLES.APPEAL_TYPE]: mapAppealTypeToDisplayText(LDC)
			})
			.addQuestion(questions.lawfulDevelopmentCertificateTypeLPAQ)
			// Does the appeal relate to a planning condition
			// Upload the planning permission
			.addQuestion(questions.enforcementNoticeDateApplication)
			.addQuestion(questions.enforcementNoticeDateApplicationUpload)
			.withCondition(() =>
				questionHasAnswer(response, questions.enforcementNoticeDateApplication, 'yes')
			)
		// Are there any related applications?
		// Upload related applications
		// Do you think the appeal is invalid?
	];
};

const baseLdcSubmissionUrl = '/manage-appeals/questionnaire';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseLdcSubmissionUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.LDC_QUESTIONNAIRE.id,
	makeSections,
	journeyTemplate: 'questionnaire-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/questionnaire',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Manage your appeals',
	makeBaseUrl
};

module.exports = { ...params, baseLdcSubmissionUrl };
