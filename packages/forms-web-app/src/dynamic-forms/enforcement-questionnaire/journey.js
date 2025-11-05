const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('@pins/dynamic-forms/src/section');
const {
	questionHasAnswer
	// questionsHaveAnswers
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
// const { APPEAL_CASE_PROCEDURE } = require('@planning-inspectorate/data-model');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');
const {
	CASE_TYPES: { ENFORCEMENT }
} = require('@pins/common/src/database/data-static');
// const config = require('../../config');
const {
	mapAppealTypeToDisplayText,
	mapAppealTypeToDisplayTextWithAnOrA
} = require('@pins/common/src/appeal-type-to-display-text');
/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('@pins/dynamic-forms/src/journey').Journey>[0], 'response'>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const makeSections = (response) => [
	new Section('Constraints, designations and other issues', 'constraints')
		.addQuestion(questions.appealTypeAppropriate)
		.withVariables({
			[QUESTION_VARIABLES.APPEAL_TYPE_WITH_AN_OR_A]:
				mapAppealTypeToDisplayTextWithAnOrA(ENFORCEMENT),
			[QUESTION_VARIABLES.APPEAL_TYPE]: mapAppealTypeToDisplayText(ENFORCEMENT)
		})
		.addQuestion(questions.changesListedBuilding)
		.addQuestion(questions.changedListedBuildings)
		.withCondition(() => questionHasAnswer(response, questions.changesListedBuilding, 'yes')),
	new Section('Site access', 'site-access').addQuestion(questions.accessForInspection),
	new Section('Appeal process', 'appeal-process').addQuestion(questions.procedureType)
];

const baseEnforcementUrl = '/manage-appeals/questionnaire';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseEnforcementUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.ENFORCEMENT_QUESTIONNAIRE.id,
	makeSections,
	journeyTemplate: 'questionnaire-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/questionnaire',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Manage your appeals',
	makeBaseUrl
};

module.exports = { ...params, baseEnforcementUrl };
