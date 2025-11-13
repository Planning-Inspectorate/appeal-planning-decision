const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('@pins/dynamic-forms/src/section');
const config = require('../../config');
const {
	questionHasAnswer
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const {
	VIEW: {
		RULE_6: { DASHBOARD }
	}
} = require('#lib/views');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('@pins/dynamic-forms/src/journey').Journey>[0], 'response'>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const makeSections = (response) => [
	new Section('', config.dynamicForms.DEFAULT_SECTION)
		.addQuestion(questions.uploadRule6ProofOfEvidenceDocuments)
		.addQuestion(questions.rule6AddWitnesses)
		.addQuestion(questions.uploadRule6WitnessesEvidence)
		.withCondition(() => questionHasAnswer(response, questions.rule6AddWitnesses, 'yes'))
];

const baseRule6ProofEvidenceUrl = '/rule-6/proof-evidence';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseRule6ProofEvidenceUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const params = {
	initialBackLink: `/${DASHBOARD}`,
	journeyId: JOURNEY_TYPES.RULE_6_PROOF_EVIDENCE.id,
	journeyTemplate: 'proof-evidence-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/proof-evidence',
	journeyTitle: 'Appeal a planning decision',
	makeSections,
	makeBaseUrl,
	makeBannerHtmlOverride: () =>
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('S78'))
};

module.exports = { baseRule6ProofEvidenceUrl, ...params };
