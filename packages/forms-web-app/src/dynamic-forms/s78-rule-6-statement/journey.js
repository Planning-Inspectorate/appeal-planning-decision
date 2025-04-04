const { questions } = require('../questions');
const { Section } = require('../section');
const config = require('../../config');
const { questionHasAnswer } = require('../dynamic-components/utils/question-has-answer');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const {
	VIEW: {
		RULE_6: { DASHBOARD }
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
const sections = [
	new Section('', config.dynamicForms.DEFAULT_SECTION)
		.addQuestion(questions.rule6Statement)
		.addQuestion(questions.rule6AdditionalDocuments)
		.addQuestion(questions.uploadRule6StatementDocuments)
		.withCondition((response) =>
			questionHasAnswer(response, questions.rule6AdditionalDocuments, 'yes')
		)
];

const baseRule6StatementUrl = '/rule-6/appeal-statement';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseRule6StatementUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const params = {
	initialBackLink: `/${DASHBOARD}`,
	journeyId: JOURNEY_TYPES.S78_RULE_6_STATEMENT,
	journeyTemplate: 'rule-6-statement-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/statement',
	journeyTitle: 'Appeal a planning decision',
	sections,
	makeBaseUrl
};

module.exports = { baseRule6StatementUrl, ...params };
