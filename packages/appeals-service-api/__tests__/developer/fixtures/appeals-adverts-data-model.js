const { exampleCasAdvertsDataModel } = require('./appeals-cas-adverts-data-model');
const { exampleS78DataModel } = require('./appeals-S78-data-model');

/**
 * @type {import('@planning-inspectorate/data-model').Schemas.AppealS78Case}
 */
const exampleAdvertsDataModel = {
	...exampleS78DataModel,
	...exampleCasAdvertsDataModel,
	caseType: 'H',
	appellantProcedurePreference: 'hearing',
	appellantProcedurePreferenceDetails: 'minim est irure laborum',
	appellantProcedurePreferenceDuration: 1,
	appellantProcedurePreferenceWitnessCount: 10,
	changedListedBuildingNumbers: ['9000009']
};

module.exports = { exampleAdvertsDataModel };
