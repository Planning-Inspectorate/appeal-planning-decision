const { exampleS78DataModel } = require('./appeals-S78-data-model');

/**
 * @type {import('@planning-inspectorate/data-model').Schemas.AppealS78Case}
 */
const exampleEnforcementDataModel = {
	...exampleS78DataModel,
	caseType: 'C',
	appellantProcedurePreference: 'hearing',
	appellantProcedurePreferenceDetails: 'minim est irure laborum',
	appellantProcedurePreferenceDuration: 1,
	appellantProcedurePreferenceWitnessCount: 10,
	ownerOccupancyStatus: 'Owner',
	occupancyConditionsMet: true,
	applicationMadeAndFeePaid: true,
	previousPlanningPermissionGranted: false,
	issueDateOfEnforcementNotice: '2023-07-27T20:30:00.000Z',
	effectiveDateOfEnforcementNotice: '2023-07-27T20:30:00.000Z',
	didAppellantAppealLpaDecision: false,
	dateLpaDecisionDue: null,
	dateLpaDecisionReceived: null,
	enforcementReference: '1234567',
	descriptionOfAllegedBreach: 'an alleged breach',
	applicationPartOrWholeDevelopment: null,
	contactPlanningInspectorateDate: '2023-07-27T20:30:00.000Z',
	enforcementAppealGroundsDetails: [
		{
			appealGroundLetter: 'a',
			groundForAppealStartDate: '2023-07-27T20:30:00.000Z',
			groundFacts: 'facts for ground a'
		},
		{
			appealGroundLetter: 'b',
			groundForAppealStartDate: '2023-07-27T20:30:00.000Z',
			groundFacts: 'facts for ground b'
		}
	]
};

module.exports = { exampleEnforcementDataModel };
