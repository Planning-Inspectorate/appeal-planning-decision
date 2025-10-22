const { exampleHASDataModel } = require('./appeals-HAS-data-model');

/**
 * @type {import('@planning-inspectorate/data-model').Schemas.AppealHASCase}
 */
const exampleCasPlanningDataModel = {
	// HAS fields
	...exampleHASDataModel,
	caseType: 'ZP',
	typeOfPlanningApplication: 'minor-commercial-development'
};

module.exports = { exampleCasPlanningDataModel };
