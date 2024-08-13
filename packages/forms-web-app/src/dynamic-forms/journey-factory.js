const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { HasJourney } = require('./has-questionnaire/journey');
const { S78Journey } = require('./s78-questionnaire/journey');
const { HasAppealFormJourney } = require('./has-appeal-form/journey');
const { S78AppealFormJourney } = require('./s78-appeal-form/journey');
const { S78LpaStatementJourney } = require('./s78-lpa-statement/journey');

/**
 * @typedef {import('./journey').Journey} Journey
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 */

const LPA_JOURNEY_TYPES_FORMATTED = {
	HAS: JOURNEY_TYPES.HAS_QUESTIONNAIRE,
	S78: JOURNEY_TYPES.S78_QUESTIONNAIRE,
	STATEMENT: JOURNEY_TYPES.S78_LPA_STATEMENT
};

const APPELLANT_JOURNEY_TYPES_FORMATTED = {
	HAS: JOURNEY_TYPES.HAS_APPEAL_FORM,
	S78: JOURNEY_TYPES.S78_APPEAL_FORM
};

/**
 * Returns a journey class based on a type string from JOURNEY_TYPES
 */
const JOURNEY_CLASSES = {
	[JOURNEY_TYPES.HAS_QUESTIONNAIRE]: HasJourney,
	[JOURNEY_TYPES.S78_QUESTIONNAIRE]: S78Journey,
	[JOURNEY_TYPES.HAS_APPEAL_FORM]: HasAppealFormJourney,
	[JOURNEY_TYPES.S78_APPEAL_FORM]: S78AppealFormJourney,
	[JOURNEY_TYPES.S78_LPA_STATEMENT]: S78LpaStatementJourney
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
	LPA_JOURNEY_TYPES_FORMATTED,
	APPELLANT_JOURNEY_TYPES_FORMATTED,
	getJourney
};
