const { questions } = require('../questions');
const { Section } = require('../section');
const config = require('../../config');
// const { questionHasAnswer } = require('../dynamic-components/utils/question-has-answer');
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
	new Section('', config.dynamicForms.DEFAULT_SECTION).addQuestion(
		questions.uploadLpaProofOfEvidenceDocuments
	)
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
	journeyId: JOURNEY_TYPES.S78_LPA_PROOF_EVIDENCE,
	journeyTemplate: 'lpa-proof-evidence-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/proof-evidence',
	journeyTitle: 'Manage your appeals',
	sections,
	makeBaseUrl
};

module.exports = { baseLpaProofEvidenceUrl, ...params };
