const { applicationTypes, decisions } = require('@pins/common/src/client/bops/consts');
const {
	APPEAL_ID,
	APPLICATION_DECISION,
	TYPE_OF_PLANNING_APPLICATION
} = require('../../constants');

/**
 * @param {string|null|undefined} bopsDecision
 */
const mapBopsDecision = (bopsDecision) => {
	switch (bopsDecision) {
		case decisions.granted:
			return APPLICATION_DECISION.GRANTED;
		case decisions.refused:
			return APPLICATION_DECISION.REFUSED;
		default:
			return APPLICATION_DECISION.NODECISIONRECEIVED;
	}
};

/**
 * @param {any} bopsApplication
 * @returns {Date|null}
 */
const mapBopsDecisionDate = (bopsApplication) => {
	if (bopsApplication.determinedAt) {
		return new Date(bopsApplication.determinedAt);
	}

	// use expiry date as decision due date if no decision yet
	if (!bopsApplication.decision && !bopsApplication.determinedAt && bopsApplication.expiryDate) {
		return new Date(bopsApplication.expiryDate);
	}

	return null;
};

/**
 * @param {any} bopsData
 * @returns {null|{allData: boolean, appealType: string|undefined, typeOfPlanningApplication: string, decisionDate: Date|null, eligibility: {applicationDecision: string}}}
 */
exports.mapBopsToBeforeYouStart = (bopsData) => {
	if (!bopsData?.application?.type) {
		return null;
	}

	const applicationDecision = mapBopsDecision(bopsData.application.decision);
	const decisionDate = mapBopsDecisionDate(bopsData.application);

	switch (bopsData.application.type.value) {
		case applicationTypes.pp_full_householder:
			return {
				appealType:
					applicationDecision === APPLICATION_DECISION.REFUSED
						? APPEAL_ID.HOUSEHOLDER
						: APPEAL_ID.PLANNING_SECTION_78,
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING,
				eligibility: { applicationDecision },
				decisionDate,
				allData: !!applicationDecision && !!decisionDate
			};
		default:
			return null;
	}
};
