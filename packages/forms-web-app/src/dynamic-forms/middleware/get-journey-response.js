const { getQuestionResponse } = require('../../lib/appeals-api-wrapper');
const { JourneyResponse } = require('../journey-response');
const logger = require('../../lib/logger');

module.exports = () => async (req, res, next) => {
	const referenceId = req.params.referenceId;
	const encodedReferenceId = encodeURIComponent(referenceId);
	let result;

	try {
		const dbResponse = await getQuestionResponse(res.locals.appeal.appealType, encodedReferenceId);
		result = new JourneyResponse(res.locals.appeal.appealType, referenceId, dbResponse?.answers);
	} catch (err) {
		logger.error(err);
		result = getDefaultResponse(res.locals.appeal.appealType, referenceId);
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
