const { HasJourney } = require('./has-questionnaire/journey');
const { S78Journey } = require('./s78-questionnaire/journey');

/**
 * @typedef {import('./journey').Journey} Journey
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 * @typedef {string} JourneyType
 */

/**
 * @enum {JourneyType}
 */
const JOURNEY_TYPES = {
	HAS_QUESTIONNAIRE: 'has-questionnaire',
	S78_QUESTIONNAIRE: 's78-questionnaire'
};

const JOURNEY_TYPES_FORMATTED = {
	HAS: JOURNEY_TYPES.HAS_QUESTIONNAIRE,
	S78: JOURNEY_TYPES.S78_QUESTIONNAIRE
};

/**
 * Returns a journey class based on a type string from JOURNEY_TYPES
 */
const JOURNEY_CLASSES = {
	[JOURNEY_TYPES.HAS_QUESTIONNAIRE]: HasJourney,
	[JOURNEY_TYPES.S78_QUESTIONNAIRE]: S78Journey
};

/**
 * creates an instance of a journey based on the journeyId passed in
 * @param {JourneyResponse} journeyResponse
 * @returns {Journey}
 */
function getJourney(journeyResponse) {
	if (JOURNEY_CLASSES[journeyResponse.journeyId] === undefined) {
		throw new Error('invalid journey type');
	}

	return new JOURNEY_CLASSES[journeyResponse.journeyId](journeyResponse);
}

module.exports = {
	JOURNEY_TYPES,
	JOURNEY_TYPES_FORMATTED,
	getJourney
};
