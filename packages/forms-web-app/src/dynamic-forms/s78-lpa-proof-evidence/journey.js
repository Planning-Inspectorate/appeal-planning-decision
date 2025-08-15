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
		.addQuestion(questions.uploadLpaProofOfEvidenceDocuments)
		.addQuestion(questions.lpaAddWitnesses)
		.addQuestion(questions.uploadLpaWitnessesEvidence)
		.withCondition(() => questionHasAnswer(response, questions.lpaAddWitnesses, 'yes'))
];

const baseLpaProofEvidenceUrl = '/manage-appeals/proof-evidence';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseLpaProofEvidenceUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const params = {
	initialBackLink: `/${DASHBOARD}`,
	journeyId: JOURNEY_TYPES.LPA_PROOF_EVIDENCE.id,
	journeyTemplate: 'lpa-proof-evidence-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/proof-evidence',
	journeyTitle: 'Manage your appeals',
	makeSections,
	makeBaseUrl
};

module.exports = { baseLpaProofEvidenceUrl, ...params };
