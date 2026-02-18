const { exampleS78DataModel } = require('./appeals-S78-data-model');

/**
 * @type {import('@planning-inspectorate/data-model').Schemas.AppealS78Case}
 */
const exampleEnforcementListedDataModel = {
	...exampleS78DataModel,
	caseType: 'F',
	appellantProcedurePreference: 'hearing',
	appellantProcedurePreferenceDetails: 'minim est irure laborum',
	appellantProcedurePreferenceDuration: 1,
	appellantProcedurePreferenceWitnessCount: 10,
	ownerOccupancyStatus: 'Owner',
	issueDateOfEnforcementNotice: '2023-07-27T20:30:00.000Z',
	effectiveDateOfEnforcementNotice: '2023-07-27T20:30:00.000Z',
	enforcementNoticeReference: '1234567',
	descriptionOfAllegedBreach: 'an alleged breach',
	dateAppellantContactedPins: '2023-07-27T20:30:00.000Z',
	applicationElbAppealGroundsDetails: [
		{
			appealGroundLetter: 'j',
			groundForAppealStartDate: '2023-07-27T20:30:00.000Z',
			groundFacts: 'facts for ground j'
		},
		{
			appealGroundLetter: 'k',
			groundForAppealStartDate: '2023-07-27T20:30:00.000Z',
			groundFacts: 'facts for ground k'
		}
	],
	noticeRelatesToBuildingEngineeringMiningOther: true,
	changeOfUseRefuseOrWaste: true,
	changeOfUseMineralExtraction: true,
	changeOfUseMineralStorage: true,
	relatesToErectionOfBuildingOrBuildings: true,
	relatesToBuildingWithAgriculturalPurpose: true,
	relatesToBuildingSingleDwellingHouse: true,
	affectedTrunkRoadName: 'trunk road name',
	isSiteOnCrownLand: true,
	article4AffectedDevelopmentRights: 'development rights removed'
};

module.exports = { exampleEnforcementListedDataModel };
