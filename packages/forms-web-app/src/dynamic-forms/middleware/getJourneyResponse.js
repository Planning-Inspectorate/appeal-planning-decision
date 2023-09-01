const { getQuestionResponse } = require('../../lib/appeals-api-wrapper');
const { JourneyResponse } = require('../journey-response');

module.exports = (journeyId) => async (req, res, next) => {
	const referenceId = encodeURIComponent(req.params.referenceId);
	let result;

	try {
		result = await getQuestionResponse(journeyId, referenceId);
	} catch {
		result = getDefaultResponse(journeyId, referenceId);
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
