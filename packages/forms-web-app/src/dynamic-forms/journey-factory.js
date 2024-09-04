const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { buildJourneyParams: buildHASLPAJourneyParams } = require('./has-questionnaire/journey');
const { buildJourneyParams: buildS78LPAJourneyParams } = require('./s78-questionnaire/journey');
const { buildJourneyParams: buildHASAppellantJourneyParams } = require('./has-appeal-form/journey');
const { buildJourneyParams: buildS78AppellantJourneyParams } = require('./s78-appeal-form/journey');
const { buildJourneyParams: S78LpaStatementJourneyParams } = require('./s78-lpa-statement/journey');
const {
	buildJourneyParams: buildS78AppellantFinalCommentsJourneyParams
} = require('./s78-appellant-final-comments/journey');
const { Journey } = require('./journey');

/**
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 */

const LPA_JOURNEY_TYPES_FORMATTED = {
	HAS: JOURNEY_TYPES.HAS_QUESTIONNAIRE,
	S78: JOURNEY_TYPES.S78_QUESTIONNAIRE,
	STATEMENT: JOURNEY_TYPES.S78_LPA_STATEMENT
};

const APPELLANT_JOURNEY_TYPES_FORMATTED = {
	HAS: JOURNEY_TYPES.HAS_APPEAL_FORM,
	S78: JOURNEY_TYPES.S78_APPEAL_FORM,
	FINAL_COMMENTS: JOURNEY_TYPES.S78_APPELLANT_FINAL_COMMENTS
};

/**
 * Returns journey constructor args based on a type string from JOURNEY_TYPES
 */
const JOURNEY_PARAMS = {
	[JOURNEY_TYPES.HAS_QUESTIONNAIRE]: buildHASLPAJourneyParams,
	[JOURNEY_TYPES.S78_QUESTIONNAIRE]: buildS78LPAJourneyParams,
	[JOURNEY_TYPES.HAS_APPEAL_FORM]: buildHASAppellantJourneyParams,
	[JOURNEY_TYPES.S78_APPEAL_FORM]: buildS78AppellantJourneyParams,
	[JOURNEY_TYPES.S78_LPA_STATEMENT]: S78LpaStatementJourneyParams,
	[JOURNEY_TYPES.S78_APPELLANT_FINAL_COMMENTS]: buildS78AppellantFinalCommentsJourneyParams
};

/**
 * creates an instance of a journey based on the journeyId passed in
 * @param {JourneyResponse} journeyResponse
 * @returns {Journey}
 */
function getJourney(journeyResponse) {
	if (JOURNEY_PARAMS[journeyResponse.journeyId] === undefined) {
		throw new Error('invalid journey type');
	}

	return new Journey(...JOURNEY_PARAMS[journeyResponse.journeyId](journeyResponse));
}

module.exports = {
	LPA_JOURNEY_TYPES_FORMATTED,
	APPELLANT_JOURNEY_TYPES_FORMATTED,
	getJourney
};
