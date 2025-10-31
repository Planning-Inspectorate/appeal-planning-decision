const { exampleHASDataModel } = require('./appeals-HAS-data-model');

/**
 * @type {import('@planning-inspectorate/data-model').Schemas.AppealS78Case}
 */
const exampleAdvertsDataModel = {
	...exampleHASDataModel,
	caseType: 'H',
	typeOfPlanningApplication: 'advertisement',
	hasLandownersPermission: true,
	advertDetails: [
		{
			advertType: null,
			isAdvertInPosition: true,
			isSiteOnHighwayLand: true
		},
		{
			advertType: 'Monolith/Totem Signs Illuminated',
			isAdvertInPosition: false,
			isSiteOnHighwayLand: false
		}
	],
	siteGridReferenceEasting: '359608',
	siteGridReferenceNorthing: '172607',
	appellantProcedurePreference: 'hearing',
	appellantProcedurePreferenceDetails: 'minim est irure laborum',
	appellantProcedurePreferenceDuration: 1,
	appellantProcedurePreferenceWitnessCount: 10,
	changedListedBuildingNumbers: ['9000009']
};

module.exports = { exampleAdvertsDataModel };
