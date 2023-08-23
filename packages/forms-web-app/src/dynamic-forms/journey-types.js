const { HasJourney } = require('./has-questionnaire/journey');
const { JourneyResponse } = require('./journey-response');

/**
 * @typedef {import('./journey').Journey} Journey
 * @typedef {string} JourneyType
 */

/**
 * @enum {JourneyType}
 */
const JOURNEY_TYPES = {
	HAS_QUESTIONNAIRE: 'has-questionnaire'
};

/**
 * creates an instance of a journey based on the journeyId passed in
 * @param {JourneyResponse} journeyResponse
 * @returns {Journey}
 */
function getJourney(journeyResponse) {
	switch (journeyResponse.journeyId) {
		case JOURNEY_TYPES.HAS_QUESTIONNAIRE:
			return new HasJourney(journeyResponse);
		default:
			throw new Error('invalid journey type');
	}
}

/**
 * gets the current response or a default empty response
 * @param {ExpressRequest} req
 * @param {JourneyType} journeyId - the type of journey
 * @param {string} referenceId - unique ref used in journey url
 */
function getJourneyResponseByType(req, journeyId, referenceId) {
	switch (journeyId) {
		case JOURNEY_TYPES.HAS_QUESTIONNAIRE:
			return req.session.lpaAnswers || getDefaultResponse(journeyId, referenceId);
		default:
			throw new Error('invalid journey type');
	}
}

/**
 * returns a default response for a journey
 * @param {JourneyType} journeyId - the type of journey
 * @param {string} referenceId - unique ref used in journey url
 * @returns {JourneyResponse}
 */
function getDefaultResponse(journeyId, referenceId) {
	return new JourneyResponse(journeyId, referenceId, null);
}

/**
 * save a journey's response to session
 * @param {ExpressRequest} req - current express request
 * @param {JourneyResponse} journeyResponse - the data to save in session
 * @returns {void}
 */
function saveResponseToSessionByType(req, journeyResponse) {
	switch (journeyResponse.journeyId) {
		case JOURNEY_TYPES.HAS_QUESTIONNAIRE:
			req.session.lpaAnswers = journeyResponse;
			break;
		default:
			throw new Error('invalid journey type');
	}
}

module.exports = {
	JOURNEY_TYPES,
	getJourney,
	getJourneyResponseByType,
	saveResponseToSessionByType
};
