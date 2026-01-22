const { exampleS78DataModel } = require('./appeals-S78-data-model');

/**
 * @type {import('@planning-inspectorate/data-model').Schemas.AppealS78Case}
 */
const exampleLDCDataModel = {
	...exampleS78DataModel,
	caseType: 'X',
	appellantProcedurePreference: 'hearing',
	appellantProcedurePreferenceDetails: 'minim est irure laborum',
	appellantProcedurePreferenceDuration: 1,
	appellantProcedurePreferenceWitnessCount: 10,
	siteUseAtTimeOfApplication: 'test',
	applicationMadeUnderActSection: 'proposed-changes-to-a-listed-building',
	appealUnderActSection: 'proposed-changes-to-a-listed-building',
	lpaConsiderAppealInvalid: true,
	lpaAppealInvalidReasons: 'reason 1, reason 2'
};

module.exports = { exampleLDCDataModel };
