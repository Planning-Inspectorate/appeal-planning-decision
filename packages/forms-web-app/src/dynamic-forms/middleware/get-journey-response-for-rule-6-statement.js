const { JourneyResponse } = require('../journey-response');
const { RULE_6_JOURNEY_TYPES_FORMATTED } = require('../journey-factory');
const logger = require('#lib/logger');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');

module.exports = () => async (req, res, next) => {
	const referenceId = req.params.referenceId;
	let result;

	const appeal = await req.appealsApiClient.getAppealCaseByCaseRef(referenceId);

	const journeyType = RULE_6_JOURNEY_TYPES_FORMATTED.STATEMENT;

	try {
		const dbResponse = await req.appealsApiClient.getRule6StatementSubmission(referenceId);
		const convertedResponse = mapDBResponseToJourneyResponseFormat(dbResponse);
		result = new JourneyResponse(
			journeyType,
			referenceId,
			convertedResponse,
			dbResponse.AppealCase?.LPACode
		);
	} catch (err) {
		if (err instanceof ApiClientError && err.code === 404) {
			logger.debug('rule 6 statement not found, creating and returning default response');
			await req.appealsApiClient.postRule6StatementSubmission(referenceId);
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
