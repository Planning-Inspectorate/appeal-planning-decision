const {
	TYPE_OF_PLANNING_APPLICATION: {
		HOUSEHOLDER_PLANNING,
		LISTED_BUILDING,
		MINOR_COMMERCIAL_DEVELOPMENT,
		ADVERTISEMENT,
		PRIOR_APPROVAL,
		REMOVAL_OR_VARIATION_OF_CONDITIONS
	},
	APPLICATION_DECISION: { REFUSED },
	APPEAL_ID,
	APPLICATION_ABOUT
} = require('@pins/business-rules/src/constants');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isLpaInFeatureFlag } = require('./is-lpa-in-feature-flag');

const getNextPageFromCanUseServicePage = async (appeal) => {
	const applicationType = appeal.typeOfPlanningApplication;
	const nextPage = await getNextPage(appeal.lpaCode);
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
		case ADVERTISEMENT:
			return nextPage.advert;

		default:
			return nextPage.fullAppeal;
	}
};

const getNextPage = async (/** @type {string} */ lpaCode) => {
	const [isV2forS78, isV2forS20, isV2forCAS, isV2forHAS, isV2forCASAdverts, isV2forAdverts] =
		await Promise.all([
			isLpaInFeatureFlag(lpaCode, FLAG.S78_APPEAL_FORM_V2),
			isLpaInFeatureFlag(lpaCode, FLAG.S20_APPEAL_FORM_V2),
			isLpaInFeatureFlag(lpaCode, FLAG.CAS_PLANNING_APPEAL_FORM_V2),
			isLpaInFeatureFlag(lpaCode, FLAG.HAS_APPEAL_FORM_V2),
			isLpaInFeatureFlag(lpaCode, FLAG.CAS_ADVERTS_APPEAL_FORM_V2),
			isLpaInFeatureFlag(lpaCode, FLAG.ADVERTS_APPEAL_FORM_V2)
		]);

	return {
		fullAppeal: `/full-appeal/submit-appeal/${
			isV2forS78 ? 'email-address' : 'planning-application-number'
		}`,
		householderPlanning: `/appeal-householder-decision/${
			isV2forHAS ? 'email-address' : 'planning-application-number'
		}`,
		listedBuilding: `/listed-building/${
			isV2forS20 ? 'email-address' : 'planning-application-number'
		}`,
		casAppeal: `/cas-planning/${isV2forCAS ? 'email-address' : 'planning-application-number'}`,
		advert: `/adverts/${
			isV2forCASAdverts || isV2forAdverts ? 'email-address' : 'planning-application-number'
		}`
	};
};

module.exports = {
	getNextPageFromCanUseServicePage
};
