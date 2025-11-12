const { exampleHASDataModel } = require('./appeals-HAS-data-model');

/**
 * @type {import('@planning-inspectorate/data-model').Schemas.AppealHASCase}
 */
const exampleCasAdvertsDataModel = {
	...exampleHASDataModel,
	caseType: 'ZA',
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
		},
		{
			advertType: null,
			isAdvertInPosition: null,
			isSiteOnHighwayLand: null
		}
	],
	siteGridReferenceEasting: '359608',
	siteGridReferenceNorthing: '172607',
	affectsScheduledMonument: true,
	hasProtectedSpecies: true,
	isAonbNationalLandscape: true,
	designatedSitesNames: ['yes', 'other designations'],
	hasStatutoryConsultees: true,
	consultedBodiesDetails: 'consultation details',
	lpaProcedurePreference: 'hearing',
	lpaProcedurePreferenceDetails: 'Hearing details',
	lpaProcedurePreferenceDuration: null,
	wasApplicationRefusedDueToHighwayOrTraffic: false,
	isSiteInAreaOfSpecialControlAdverts: true,
	didAppellantSubmitCompletePhotosAndPlans: true
};

module.exports = { exampleCasAdvertsDataModel };
