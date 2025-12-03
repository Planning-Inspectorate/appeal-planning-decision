const {
	questionHasAnswer,
	questionsHaveAnswers
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer.js');
const { APPLICATION_DECISION } = require('@pins/business-rules/src/constants');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('@pins/dynamic-forms/src/question')} Question
 */

/**
 * @param {JourneyResponse} response
 * @param {Record<string, Question>} questions
 * @returns {boolean}
 */
exports.shouldDisplayIdentifyingLandowners = (response, questions) => {
	if (questionHasAnswer(response, questions.ownsAllLand, 'yes')) return false;
	if (
		questionHasAnswer(response, questions.ownsSomeLand, 'yes') &&
		questionHasAnswer(response, questions.knowsWhoOwnsRestOfLand, 'yes')
	)
		return false;
	if (
		questionHasAnswer(response, questions.ownsSomeLand, 'no') &&
		questionHasAnswer(response, questions.knowsWhoOwnsLandInvolved, 'yes')
	)
		return false;

	return true;
};

/**
 * @param {JourneyResponse} response
 * @param {Record<string, Question>} questions
 * @returns {boolean}
 */
exports.shouldDisplayTellingLandowners = (response, questions) => {
	if (questionHasAnswer(response, questions.ownsAllLand, 'yes')) return false;

	if (
		questionsHaveAnswers(
			response,
			[
				[questions.ownsSomeLand, 'yes'],
				[questions.knowsWhoOwnsRestOfLand, 'no']
			],
			{ logicalCombinator: 'and' }
		) ||
		questionsHaveAnswers(
			response,
			[
				[questions.ownsSomeLand, 'no'],
				[questions.knowsWhoOwnsLandInvolved, 'no']
			],
			{ logicalCombinator: 'and' }
		)
	)
		return false;

	return true;
};

/**
 * @param {JourneyResponse} response
 * @param {Record<string, Question>} questions
 * @returns {boolean}
 */
exports.shouldDisplayTellingTenants = (response, questions) => {
	if (
		questionHasAnswer(response, questions.agriculturalHolding, 'yes') &&
		(questionHasAnswer(response, questions.tenantAgriculturalHolding, 'no') ||
			questionsHaveAnswers(
				response,
				[
					[questions.tenantAgriculturalHolding, 'yes'],
					[questions.otherTenantsAgriculturalHolding, 'yes']
				],
				{ logicalCombinator: 'and' }
			))
	)
		return true;

	return false;
};

/**
 * @param {JourneyResponse} response
 * @returns {boolean}
 */
exports.shouldDisplayUploadDecisionLetter = (response) => {
	return response.answers.applicationDecision !== APPLICATION_DECISION.NODECISIONRECEIVED;
};

/**
 * @param {JourneyResponse} response
 * @returns {boolean}
 */
exports.shouldDisplayAdvertsQuestions = (response) => {
	return response.answers.applicationDecision !== APPLICATION_DECISION.REFUSED;
};

/**
 * @param {JourneyResponse} response
 * @param {import('../config')|undefined} config
 * @returns {boolean}
 */
exports.shouldDisplayGridReference = (response, config) => {
	if (config?.featureFlag.gridReferenceEnabled === false) return false;

	if (response.answers.siteAddress !== null) return false;
	else
		return (
			response.answers.siteGridReferenceEasting !== null &&
			response.answers.siteGridReferenceNorthing !== null
		);
};
