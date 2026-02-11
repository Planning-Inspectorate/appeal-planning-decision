module.exports = class AppealFixtures {
	/**
	 *
	 * @param param0 You can specify the following keys in this object, but defaults are provided:
	 * <ul>
	 * <li><i>id</i>: set to '' by default</li>
	 * <li><i>decision</i>: Valid values are: 'granted', 'refused', or 'nodecisionreceived'. Set to 'granted' by default.</li>
	 * <li><i>planningApplicationType</i>: Valid values are: 'householder-planning', 'full-appeal', 'outline-planning',
	 * 'prior-approval', 'reserved-matters', or 'removal-or-variation-of-conditions. Set to 'householder-planning' by default.</li>
	 * <li>ownsSite</i>: Valid values are boolean true/false. Defaults to false.
	 * <li>agentAppeal</i>: Valid values are boolean true/false. Defaults to false.
	 * </ul>
	 * @returns Given no changes to input parameters, a new, valid, householder appeal.
	 */
	static newHouseholderAppeal({
		id = '',
		decision = 'granted',
		planningApplicationType = 'householder-planning'
	} = {}) {
		let appeal = {
			id: id,
			lpaCode: 'E69999999',
			decisionDate: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
			submissionDate: new Date(),
			state: 'DRAFT',
			appealType: '1001',
			typeOfPlanningApplication: planningApplicationType,
			planningApplicationNumber: '12345',
			email: 'test@example.com',
			eligibility: {
				applicationDecision: decision,
				enforcementNotice: false,
				householderPlanningPermission: true,
				isClaimingCosts: false,
				isListedBuilding: false,
				hasPriorApprovalForExistingHome: true,
				hasHouseholderPermissionConditions: true
			}
		};

		return appeal;
	}

	/**
	 *
	 * @param param0 You can specify the following keys in this object, but defaults are provided:
	 * <ul>
	 * <li><i>id</i>: set to '' by default</li>
	 * <li><i>decision</i>: Valid values are: 'granted', 'refused', or 'nodecisionreceived'. Set to 'granted' by default.</li>
	 * <li><i>planningApplicationType</i>: Valid values are: 'householder-planning', 'full-appeal', 'outline-planning',
	 * 'prior-approval', 'reserved-matters', or 'removal-or-variation-of-conditions. Set to 'householder-planning' by default.</li>
	 * <li>ownsAllLand</i>: Valid values are boolean true/false. Defaults to false.
	 * </ul>
	 * @returns Given no changes to input paramters, a new, valid, full appeal.
	 */
	static newFullAppeal({
		id = '',
		decision = 'granted',
		planningApplicationType = 'householder-planning' //todo: is this correct?
	} = {}) {
		let appeal = {
			id: id,
			lpaCode: 'E69999999',
			planningApplicationNumber: '12345',
			email: 'test@example.com',
			createdAt: new Date(),
			updatedAt: new Date(),
			submissionDate: new Date(),
			decisionDate: new Date(),
			typeOfPlanningApplication: planningApplicationType,
			appealType: '1005',
			state: 'DRAFT',
			eligibility: {
				hasHouseholderPermissionConditions: true,
				hasPriorApprovalForExistingHome: true,
				enforcementNotice: false,
				applicationDecision: decision
			}
		};

		return appeal;
	}
};
