const { JourneyResponse } = require('../journey-response');
const { LPA_JOURNEY_TYPES_FORMATTED } = require('../journey-factory');
const logger = require('#lib/logger');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const { apiClient } = require('#lib/appeals-api-client');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');

module.exports = () => async (req, res, next) => {
	const referenceId = req.params.referenceId;
	const encodedReferenceId = encodeURIComponent(referenceId);
	let result;

	const user = getLPAUserFromSession(req);

	const appeal = await apiClient.getUsersAppealCase({
		caseReference: encodedReferenceId,
		userId: user.id,
		role: LPA_USER_ROLE
	});

	const appealType = LPA_JOURNEY_TYPES_FORMATTED[appeal.appealTypeCode];

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
		if (err instanceof ApiClientError && err.code === 404) {
			logger.debug('questionnaire not found, creating and returning default response');
			await apiClient.postLPAQuestionnaire(referenceId);
		} else {
			logger.error(err);
		}
		// return default response
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
