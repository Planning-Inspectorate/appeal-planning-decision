const { getQuestionResponse } = require('../../lib/appeals-api-wrapper');
const { JourneyResponse } = require('../journey-response');
const { JOURNEY_TYPES_FORMATTED } = require('../journey-factory');
const logger = require('../../lib/logger');
const { getAppealByLPACodeAndId } = require('../../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');

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
		const dbResponse = await getQuestionResponse(appealType, encodedReferenceId);
		result = new JourneyResponse(appealType, referenceId, dbResponse?.answers);
	} catch (err) {
		logger.error(err);
		result = getDefaultResponse(appealType, referenceId);
	}

	res.locals.journeyResponse = result;

	return next();
};

/**
 * returns a default response for a journey
 * @param {JourneyType} journeyId - the type of journey
 * @param {string} referenceId - unique ref used in journey url
 * @returns {JourneyResponse}
 */
function getDefaultResponse(journeyId, referenceId) {
	return new JourneyResponse(journeyId, referenceId, null);
}
