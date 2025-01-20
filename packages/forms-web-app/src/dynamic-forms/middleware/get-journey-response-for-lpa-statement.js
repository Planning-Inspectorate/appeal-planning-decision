const { JourneyResponse } = require('../journey-response');
const { LPA_JOURNEY_TYPES_FORMATTED } = require('../journey-factory');
const { APPEAL_CASE_STATUS } = require('pins-data-model');
const logger = require('#lib/logger');
const { getUserFromSession } = require('../../services/user.service');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const { deadlineHasPassed } = require('../../lib/deadline-has-passed');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const {
	VIEW: {
		LPA_DASHBOARD: { APPEAL_OVERVIEW }
	}
} = require('../../lib/views');

module.exports = () => async (req, res, next) => {
	const referenceId = req.params.referenceId;
	const encodedReferenceId = encodeURIComponent(referenceId);
	const appealOverviewUrl = `${APPEAL_OVERVIEW}/${referenceId}`;
	let result;

	const user = getUserFromSession(req);

	const appeal = await req.appealsApiClient.getUsersAppealCase({
		caseReference: encodedReferenceId,
		userId: user.id,
		role: LPA_USER_ROLE
	});

	if (
		(appeal.caseStatus !== APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE ||
			!deadlineHasPassed(appeal.lpaQuestionnaireDueDate)) &&
		appeal.caseStatus !== APPEAL_CASE_STATUS.STATEMENTS
	) {
		return res.redirect(appealOverviewUrl);
	}

	let journeyType;

	if (deadlineHasPassed(appeal.lpaQuestionnaireDueDate)) {
		journeyType = LPA_JOURNEY_TYPES_FORMATTED.STATEMENT;
	}

	if (typeof journeyType === 'undefined') {
		throw new Error('journeyType is undefined');
	}

	try {
		const dbResponse = await req.appealsApiClient.getLPAStatement(referenceId);
		const convertedResponse = mapDBResponseToJourneyResponseFormat(dbResponse);
		result = new JourneyResponse(
			journeyType,
			referenceId,
			convertedResponse,
			dbResponse.AppealCase?.LPACode
		);
	} catch (err) {
		if (err instanceof ApiClientError && err.code === 404) {
			logger.debug('statement not found, creating and returning default response');
			await req.appealsApiClient.postLPAStatement(referenceId);
		} else {
			logger.error(err);
		}
		// return default response
		result = getDefaultResponse(journeyType, referenceId, user.lpaCode);
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
