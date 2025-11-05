const { exampleCasAdvertsDataModel } = require('./appeals-cas-adverts-data-model');

/**
 * @type {import('@planning-inspectorate/data-model').Schemas.AppealS78Case}
 */
const exampleAdvertsDataModel = {
	...exampleCasAdvertsDataModel,
	caseType: 'H',
	typeOfPlanningApplication: 'advertisement',
	lpaProcedurePreference: 'written',
	lpaProcedurePreferenceDetails: null,
	lpaProcedurePreferenceDuration: null
};

module.exports = { exampleAdvertsDataModel };
