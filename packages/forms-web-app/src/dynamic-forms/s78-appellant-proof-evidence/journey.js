const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('../section');
const config = require('../../config');
const { questionHasAnswer } = require('../dynamic-components/utils/question-has-answer');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const {
	VIEW: {
		APPEALS: { YOUR_APPEALS }
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
		.addQuestion(questions.uploadAppellantProofOfEvidenceDocuments)
		.addQuestion(questions.appellantAddWitnesses)
		.addQuestion(questions.uploadAppellantWitnessesEvidence)
		.withCondition((response) =>
			questionHasAnswer(response, questions.appellantAddWitnesses, 'yes')
		)
];

const baseAppellantProofEvidenceUrl = '/appeals/proof-evidence';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseAppellantProofEvidenceUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const params = {
	initialBackLink: `/${YOUR_APPEALS}`,
	journeyId: JOURNEY_TYPES.S78_APPELLANT_PROOF_EVIDENCE,
	journeyTemplate: 'proof-evidence-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/proof-evidence',
	journeyTitle: 'Appeal a planning decision',
	sections,
	makeBaseUrl,
	bannerHtmlOverride:
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('S78'))
};

module.exports = { baseAppellantProofEvidenceUrl, ...params };
