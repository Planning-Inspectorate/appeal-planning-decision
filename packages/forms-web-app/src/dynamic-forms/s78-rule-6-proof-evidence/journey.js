const { questions } = require('../questions');
const { Section } = require('../section');
const config = require('../../config');
const { questionHasAnswer } = require('../dynamic-components/utils/question-has-answer');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');

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
		.addQuestion(questions.uploadRule6ProofOfEvidenceDocuments)
		.addQuestion(questions.rule6AddWitnesses)
		.addQuestion(questions.uploadRule6WitnessesEvidence)
		.withCondition((response) => questionHasAnswer(response, questions.rule6AddWitnesses, 'yes'))
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
	journeyId: JOURNEY_TYPES.S78_RULE_6_PROOF_EVIDENCE,
	journeyTemplate: 'proof-evidence-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/proof-evidence',
	journeyTitle: 'Appeal a planning decision',
	sections,
	makeBaseUrl
};

module.exports = { baseRule6ProofEvidenceUrl, ...params };
