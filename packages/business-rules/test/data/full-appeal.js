const appeal = {
	id: 'fc7cb757-fe21-46dd-b3fd-121c385cd884',
	lpaCode: 'E69999999',
	planningApplicationNumber: 'ABCDE12345',
	decisionDate: new Date(),
	createdAt: new Date(),
	updatedAt: new Date(),
	submissionDate: new Date(),
	state: 'SUBMITTED',
	appealType: '1005',
	typeOfPlanningApplication: 'full-appeal',
	email: 'testemail@example.com',
	hideFromDashboard: true,
	eligibility: {
		applicationCategories: ['none_of_these'],
		applicationDecision: 'granted',
		enforcementNotice: false,
		hasPriorApprovalForExistingHome: true,
		hasHouseholderPermissionConditions: false,
		isListedBuilding: false
	}
};

module.exports = appeal;
