const { exampleHASDataModel } = require('./appeals-HAS-data-model');

/**
 * @type {import('@planning-inspectorate/data-model').Schemas.AppealHASCase}
 */
const exampleCasAdvertsDataModel = {
	...exampleHASDataModel,
	caseType: 'ZA',
	typeOfPlanningApplication: 'advertisement',
	hasLandownersPermission: true,
	isAdvertInPosition: true,
	isSiteOnHighwayLand: true,
	siteGridReferenceEasting: '359608',
	siteGridReferenceNorthing: '172607'
};

module.exports = { exampleCasAdvertsDataModel };
