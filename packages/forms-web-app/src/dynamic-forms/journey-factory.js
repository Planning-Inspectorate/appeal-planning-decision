const { JOURNEY_TYPES } = require('./journey-types');
const { HasJourney } = require('./has-questionnaire/journey');
const { S78Journey } = require('./s78-questionnaire/journey');

/**
 * @typedef {import('./journey').Journey} Journey
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 */

const JOURNEY_TYPES_FORMATTED = {
	HAS: JOURNEY_TYPES.HAS_QUESTIONNAIRE,
	S78: JOURNEY_TYPES.S78_QUESTIONNAIRE
};

/**
 * Returns a journey class based on a type string from JOURNEY_TYPES
 */
const JOURNEY_CLASSES = {
	[JOURNEY_TYPES.HAS_QUESTIONNAIRE]: HasJourney,
	[JOURNEY_TYPES.S78_QUESTIONNAIRE]: S78Journey,
	[JOURNEY_TYPES.HAS_APPEAL_FORM]: '', // TODO: add appeal form journey when created
	[JOURNEY_TYPES.S78_APPEAL_FORM]: '' // TODO: add appeal form journey when created
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

	// @ts-ignore remove ignore once HAS_APPEAL_FORM and S78_APPEAL_FORM journeys are added
	return new JOURNEY_CLASSES[journeyResponse.journeyId](journeyResponse);
}

module.exports = {
	JOURNEY_TYPES_FORMATTED,
	getJourney
};
