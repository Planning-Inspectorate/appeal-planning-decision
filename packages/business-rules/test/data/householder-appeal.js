const appeal = {
	id: 'fc7cb757-fe21-46dd-b3fd-121c385cd884',
	horizonId: 'HORIZON123',
	lpaCode: 'E69999999',
	decisionDate: new Date(),
	createdAt: new Date(),
	updatedAt: new Date(),
	submissionDate: new Date(),
	state: 'DRAFT',
	appealType: '1001',
	typeOfPlanningApplication: 'householder-planning',
	planningApplicationNumber: '12345',
	email: 'test@example.com',
	hideFromDashboard: true,
	eligibility: {
		applicationDecision: 'granted',
		enforcementNotice: false,
		householderPlanningPermission: true,
		isClaimingCosts: false,
		isListedBuilding: false,
		hasPriorApprovalForExistingHome: true,
		hasHouseholderPermissionConditions: true
	}
};

module.exports = appeal;
