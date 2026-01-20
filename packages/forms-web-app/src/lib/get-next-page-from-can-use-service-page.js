const {
	TYPE_OF_PLANNING_APPLICATION: {
		HOUSEHOLDER_PLANNING,
		LISTED_BUILDING,
		MINOR_COMMERCIAL_DEVELOPMENT,
		ADVERTISEMENT,
		PRIOR_APPROVAL,
		REMOVAL_OR_VARIATION_OF_CONDITIONS,
		LAWFUL_DEVELOPMENT_CERTIFICATE
	},
	APPLICATION_DECISION: { REFUSED },
	APPEAL_ID,
	APPLICATION_ABOUT
} = require('@pins/business-rules/src/constants');

const getNextPageFromCanUseServicePage = async (appeal) => {
	const applicationType = appeal.typeOfPlanningApplication;
	const nextPage = await getNextPage();
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
			if (
				appeal.eligibility.planningApplicationAbout?.includes(APPLICATION_ABOUT.NON_OF_THESE) &&
				applicationDecision === REFUSED
			) {
				return nextPage.casAppeal;
			}
			return nextPage.fullAppeal;
		case ADVERTISEMENT:
			if (applicationDecision === REFUSED) {
				return nextPage.casAdvert;
			}
			return nextPage.advert;
		case LAWFUL_DEVELOPMENT_CERTIFICATE:
			return nextPage.ldc;
		default:
			return nextPage.fullAppeal;
	}
};

const getNextPage = async () => {
	return {
		fullAppeal: `/full-appeal/submit-appeal/email-address`,
		householderPlanning: `/appeal-householder-decision/email-address`,
		listedBuilding: `/listed-building/email-address`,
		casAppeal: `/cas-planning/email-address`,
		casAdvert: `/adverts/email-address`,
		advert: `/adverts/email-address`,
		ldc: `/ldc/email-address`
	};
};

module.exports = {
	getNextPageFromCanUseServicePage
};
