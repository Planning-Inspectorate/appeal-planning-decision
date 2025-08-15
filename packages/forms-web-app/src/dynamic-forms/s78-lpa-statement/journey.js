const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('../section');
const config = require('../../config');
const { questionHasAnswer } = require('../dynamic-components/utils/question-has-answer');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD }
	}
} = require('#lib/views');

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('../journey').Journey>[0], 'response'>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const makeSections = (response) => [
	new Section('', config.dynamicForms.DEFAULT_SECTION)
		.addQuestion(questions.lpaStatement)
		.addQuestion(questions.additionalDocuments)
		.addQuestion(questions.uploadLpaStatementDocuments)
		.withCondition(() => questionHasAnswer(response, questions.additionalDocuments, 'yes'))
];

const baseS78StatementUrl = '/manage-appeals/appeal-statement';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseS78StatementUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const params = {
	initialBackLink: `/${DASHBOARD}`,
	journeyId: JOURNEY_TYPES.LPA_STATEMENT.id,
	journeyTemplate: 'statement-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/statement',
	journeyTitle: 'Manage your appeals',
	makeSections,
	makeBaseUrl
};

module.exports = { baseS78StatementUrl, ...params };
