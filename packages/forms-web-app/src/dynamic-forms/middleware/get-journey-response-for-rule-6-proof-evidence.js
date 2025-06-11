const { JourneyResponse } = require('../journey-response');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const logger = require('#lib/logger');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const {
	isRule6ProofsOfEvidenceOpen
} = require('@pins/business-rules/src/rules/appeal-case/case-due-dates');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');
const {
	VIEW: {
		RULE_6: { APPEAL_OVERVIEW }
	}
} = require('../../lib/views');

/**
 * @param {boolean} checkSubmitted
 * @returns {import('express').Handler}
 */
module.exports =
	(checkSubmitted = true) =>
	async (req, res, next) => {
		const referenceId = req.params.referenceId;
		const appealOverviewUrl = `${APPEAL_OVERVIEW}/${referenceId}`;
		let result;

		const appeal = await req.appealsApiClient.getAppealCaseByCaseRef(referenceId);

		if (checkSubmitted && !isRule6ProofsOfEvidenceOpen(appeal)) {
			req.session.navigationHistory.shift();
			return res.redirect(appealOverviewUrl);
		}

		const journeyType = JOURNEY_TYPES.RULE_6_PROOF_EVIDENCE.id;

		try {
			const dbResponse = await req.appealsApiClient.getRule6ProofOfEvidenceSubmission(referenceId);
			const convertedResponse = mapDBResponseToJourneyResponseFormat(dbResponse);
			result = new JourneyResponse(
				journeyType,
				referenceId,
				convertedResponse,
				dbResponse.AppealCase?.LPACode
			);
		} catch (err) {
			if (err instanceof ApiClientError && err.code === 404) {
				logger.debug('proof of evidence not found, creating and returning default response');
				await req.appealsApiClient.postRule6ProofOfEvidenceSubmission(referenceId);
			} else {
				logger.error(err);
			}
			// return default response
			result = getDefaultResponse(journeyType, referenceId, appeal.LPACode);
		}

		res.locals.journeyResponse = result;

		return next();
	};

/**
 * returns a default response for a journey
 * @param {JourneyType} journeyId - the type of journey
 * @param {string} referenceId - unique ref used in journey url
 * @param {string} lpaCode - the lpa code the journey response belongs to
 * @returns {JourneyResponse}
 */
function getDefaultResponse(journeyId, referenceId, lpaCode) {
	return new JourneyResponse(journeyId, referenceId, null, lpaCode);
}
