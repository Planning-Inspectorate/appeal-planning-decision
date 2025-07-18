const { exampleHASDataModel } = require('./appeals-HAS-data-model');
const { exampleS78DataModel } = require('./appeals-S78-data-model');

/**
 * @type {import('@planning-inspectorate/data-model').Schemas.AppealS78Case}
 */
const exampleS20DataModel = {
	// HAS fields
	...exampleHASDataModel,
	// S78 fields
	...exampleS78DataModel,
	caseType: 'Y',

	// potential for different planning application type
	typeOfPlanningApplication: 'listed-building',

	// no agricultural fields
	agriculturalHolding: null,
	tenantAgriculturalHolding: null,
	otherTenantsAgriculturalHolding: null,
	informedTenantsAgriculturalHolding: null,

	// s20 fields
	preserveGrantLoan: true,
	consultHistoricEngland: true
};

module.exports = { exampleS20DataModel };
