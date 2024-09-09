const { JourneyResponse } = require('../journey-response');
const { APPELLANT_JOURNEY_TYPES_FORMATTED } = require('../journey-factory');
const logger = require('#lib/logger');
// const { getUserFromSession } = require('../../services/user.service');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');
// const { appeal } = require('@pins/business-rules/src/config');
// const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

module.exports = () => async (req, res, next) => {
	const appealNumber = req.params.appealNumber;
	// const encodedReferenceId = encodeURIComponent(appealNumber);
	let result;

	// const appeal = await req.appealsApiClient.getAppealCaseByCaseRef(encodedReferenceId);

	const journeyType = APPELLANT_JOURNEY_TYPES_FORMATTED.FINAL_COMMENTS;

	try {
		const dbResponse = await req.appealsApiClient.getAppellantFinalCommentSubmission(appealNumber);
		const convertedResponse = mapDBResponseToJourneyResponseFormat(dbResponse);
		result = new JourneyResponse(
			journeyType,
			appealNumber,
			convertedResponse,
			dbResponse.AppealCase?.LPACode
		);
	} catch (err) {
		if (err instanceof ApiClientError && err.code === 404) {
			logger.debug('final comment not found, creating and returning default response');
			await req.appealsApiClient.postAppellantFinalCommentSubmission(appealNumber);
		} else {
			logger.error(err);
		}
		// return default response
		result = getDefaultResponse(journeyType, appealNumber, 'user.lpaCode');
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
