const {
	TYPE_OF_PLANNING_APPLICATION,
	APPLICATION_DECISION
} = require('@pins/business-rules/src/constants');

const pages = {
	fullAppeal: '/full-appeal/submit-appeal/planning-application-number',
	householderPlanningTaskList: '/appellant-submission/task-list'
};

const chooseAppropriateApplicationNumberPage = (appeal) => {
	const applicationType = appeal.typeOfPlanningApplication;
	const {
		applicationDecision,
		hasPriorApprovalForExistingHome,
		hasHouseholderPermissionConditions
	} = appeal.eligibility;

	switch (applicationType) {
		case TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING:
			if (applicationDecision === APPLICATION_DECISION.REFUSED) {
				return pages.householderPlanningTaskList;
			}
			return pages.fullAppeal;
		case TYPE_OF_PLANNING_APPLICATION.PRIOR_APPROVAL:
			if (hasPriorApprovalForExistingHome && applicationDecision === APPLICATION_DECISION.REFUSED) {
				return pages.householderPlanningTaskList;
			}
			return pages.fullAppeal;
		case TYPE_OF_PLANNING_APPLICATION.REMOVAL_OR_VARIATION_OF_CONDITIONS:
			if (
				hasHouseholderPermissionConditions &&
				applicationDecision === APPLICATION_DECISION.REFUSED
			) {
				return pages.householderPlanningTaskList;
			}
			return pages.fullAppeal;
		default:
			return pages.fullAppeal;
	}
};

module.exports = {
	chooseAppropriateApplicationNumberPage
};
