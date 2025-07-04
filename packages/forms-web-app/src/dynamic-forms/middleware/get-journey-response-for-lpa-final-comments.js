const { JourneyResponse } = require('@pins/dynamic-forms/src/journey-response');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const logger = require('#lib/logger');
const { getUserFromSession } = require('../../services/user.service');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const {
	isLPAFinalCommentOpen
} = require('@pins/business-rules/src/rules/appeal-case/case-due-dates');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const {
	VIEW: {
		LPA_DASHBOARD: { APPEAL_OVERVIEW }
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

		const user = getUserFromSession(req);

		const appeal = await req.appealsApiClient.getUsersAppealCase({
			caseReference: referenceId,
			userId: user.id,
			role: LPA_USER_ROLE
		});

		if (checkSubmitted && !isLPAFinalCommentOpen(appeal)) {
			req.session.navigationHistory.shift();
			return res.redirect(appealOverviewUrl);
		}

		const journeyType = JOURNEY_TYPES.LPA_FINAL_COMMENTS.id;

		try {
			const dbResponse = await req.appealsApiClient.getLPAFinalCommentSubmission(referenceId);
			const convertedResponse = mapDBResponseToJourneyResponseFormat(dbResponse);
			result = new JourneyResponse(
				journeyType,
				referenceId,
				convertedResponse,
				dbResponse.AppealCase?.LPACode
			);
		} catch (err) {
			if (err instanceof ApiClientError && err.code === 404) {
				logger.debug('lpa final comment not found, creating and returning default response');
				await req.appealsApiClient.postLPAFinalCommentSubmission(referenceId);
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
