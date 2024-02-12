const { JourneyResponse } = require('../journey-response');
const { JOURNEY_TYPES_FORMATTED } = require('../journey-factory');
const logger = require('../../lib/logger');
const { getAppealByLPACodeAndId } = require('../../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const { apiClient } = require('../../lib/appeals-api-client');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');

module.exports = () => async (req, res, next) => {
	const referenceId = req.params.referenceId;
	const encodedReferenceId = encodeURIComponent(referenceId);
	let result;

	const user = getLPAUserFromSession(req);
	const appeal = await getAppealByLPACodeAndId(user.lpaCode, encodedReferenceId);

	const appealType = JOURNEY_TYPES_FORMATTED[appeal.appealType];

	if (typeof appealType === 'undefined') {
		throw new Error('appealType is undefined');
	}

	try {
		const dbResponse = await apiClient.getLPAQuestionnaire(referenceId);
		const convertedResponse = mapDBResponseToJourneyResponseFormat(dbResponse);
		result = new JourneyResponse(
			appealType,
			referenceId,
			convertedResponse,
			dbResponse.AppealCase?.LPACode
		);
	} catch (err) {
		logger.error(err);
		await apiClient.postLPAQuestionnaire(referenceId);
		result = getDefaultResponse(appealType, referenceId, user.lpaCode);
	}

	if (result.LPACode !== user.lpaCode) {
		return res.status(404).render('error/not-found');
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
