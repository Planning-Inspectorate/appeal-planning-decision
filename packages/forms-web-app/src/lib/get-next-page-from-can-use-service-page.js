const {
	TYPE_OF_PLANNING_APPLICATION: {
		HOUSEHOLDER_PLANNING,
		LISTED_BUILDING,
		MINOR_COMMERCIAL_DEVELOPMENT,
		PRIOR_APPROVAL,
		REMOVAL_OR_VARIATION_OF_CONDITIONS
	},
	APPLICATION_DECISION: { REFUSED },
	APPEAL_ID,
	APPLICATION_ABOUT
} = require('@pins/business-rules/src/constants');

const nextPage = {
	fullAppeal: '/full-appeal/submit-appeal/planning-application-number',
	householderPlanning: '/appeal-householder-decision/planning-application-number',
	listedBuilding: '/listed-building/planning-application-number',
	casAppeal: '/cas-planning/planning-application-number'
};

const getNextPageFromCanUseServicePage = (appeal) => {
	const applicationType = appeal.typeOfPlanningApplication;
	const {
		applicationDecision,
		hasPriorApprovalForExistingHome,
		hasHouseholderPermissionConditions
	} = appeal.eligibility;

	switch (applicationType) {
		case HOUSEHOLDER_PLANNING:
			if (applicationDecision === REFUSED) {
				return nextPage.householderPlanning;
			}
			return nextPage.fullAppeal;
		case PRIOR_APPROVAL:
			if (hasPriorApprovalForExistingHome && applicationDecision === REFUSED) {
				return nextPage.householderPlanning;
			}
			return nextPage.fullAppeal;
		case REMOVAL_OR_VARIATION_OF_CONDITIONS:
			if (appeal.appealType === APPEAL_ID.PLANNING_LISTED_BUILDING) {
				return nextPage.listedBuilding;
			}
			if (hasHouseholderPermissionConditions && applicationDecision === REFUSED) {
				return nextPage.householderPlanning;
			}
			return nextPage.fullAppeal;
		case LISTED_BUILDING:
			return nextPage.listedBuilding;
		case MINOR_COMMERCIAL_DEVELOPMENT:
			if (appeal.eligibility.planningApplicationAbout?.includes(APPLICATION_ABOUT.NON_OF_THESE)) {
				return nextPage.casAppeal;
			}
			return nextPage.fullAppeal;
		default:
			return nextPage.fullAppeal;
	}
};

module.exports = {
	getNextPageFromCanUseServicePage
};
