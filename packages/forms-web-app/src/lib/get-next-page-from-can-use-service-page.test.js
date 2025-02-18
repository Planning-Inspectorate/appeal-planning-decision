const {
	TYPE_OF_PLANNING_APPLICATION: {
		FULL_APPEAL,
		OUTLINE_PLANNING,
		RESERVED_MATTERS,
		HOUSEHOLDER_PLANNING,
		PRIOR_APPROVAL,
		REMOVAL_OR_VARIATION_OF_CONDITIONS,
		LISTED_BUILDING
	},
	APPLICATION_DECISION: { REFUSED, GRANTED, NODECISIONRECEIVED },
	APPEAL_ID
} = require('@pins/business-rules/src/constants');
const { getNextPageFromCanUseServicePage } = require('./get-next-page-from-can-use-service-page');

const householderNextPage = '/appeal-householder-decision/planning-application-number';
const fullAppealNextPage = '/full-appeal/submit-appeal/planning-application-number';
const listedBuildingNextPage = '/listed-building/planning-application-number';

describe('getNextPageFromCanUseServicePage', () => {
	it('returns correct page (householder) for householder application- refused', () => {
		const appeal = {
			typeOfPlanningApplication: HOUSEHOLDER_PLANNING,
			eligibility: {
				applicationDecision: REFUSED
			}
		};
		expect(getNextPageFromCanUseServicePage(appeal)).toEqual(householderNextPage);
	});
	it('returns correct page (full appeal) for householder application- granted', () => {
		const appeal = {
			typeOfPlanningApplication: HOUSEHOLDER_PLANNING,
			eligibility: {
				applicationDecision: GRANTED
			}
		};
		expect(getNextPageFromCanUseServicePage(appeal)).toEqual(fullAppealNextPage);
	});

	it('returns correct page (full appeal) for householder application - no decision received', () => {
		const appeal = {
			typeOfPlanningApplication: HOUSEHOLDER_PLANNING,
			eligibility: {
				applicationDecision: NODECISIONRECEIVED
			}
		};
		expect(getNextPageFromCanUseServicePage(appeal)).toEqual(fullAppealNextPage);
	});
	it.each([
		[GRANTED, true],
		[GRANTED, false],
		[REFUSED, false],
		[NODECISIONRECEIVED, true],
		[NODECISIONRECEIVED, false]
	])(
		'returns correct page (full appeal) for prior approval application %s where prior approval for existing home is %s ',
		(decision, existingHome) => {
			const appeal = {
				typeOfPlanningApplication: PRIOR_APPROVAL,
				eligibility: {
					applicationDecision: decision,
					hasPriorApprovalForExistingHome: existingHome
				}
			};
			expect(getNextPageFromCanUseServicePage(appeal)).toEqual(fullAppealNextPage);
		}
	);
	it('returns correct page (householder appeal) for prior approval - refused householder', () => {
		const appeal = {
			typeOfPlanningApplication: PRIOR_APPROVAL,
			eligibility: {
				applicationDecision: REFUSED,
				hasPriorApprovalForExistingHome: true
			}
		};
		expect(getNextPageFromCanUseServicePage(appeal)).toEqual(householderNextPage);
	});

	it('returns correct page (listed building if removal or variation of conditions application and s20 appeal type', () => {
		const appeal = {
			appealType: APPEAL_ID.PLANNING_LISTED_BUILDING,
			typeOfPlanningApplication: REMOVAL_OR_VARIATION_OF_CONDITIONS,
			eligibility: {}
		};
		expect(getNextPageFromCanUseServicePage(appeal)).toEqual(listedBuildingNextPage);
	});

	it('returns correct page (householder) if removal or variation of conditions (refused) and householder permission conditions true', () => {
		const appeal = {
			typeOfPlanningApplication: REMOVAL_OR_VARIATION_OF_CONDITIONS,
			eligibility: {
				hasHouseholderPermissionConditions: true,
				applicationDecision: REFUSED
			}
		};
		expect(getNextPageFromCanUseServicePage(appeal)).toEqual(householderNextPage);
	});

	it.each([
		[GRANTED, true],
		[GRANTED, false],
		[REFUSED, false],
		[NODECISIONRECEIVED, true],
		[NODECISIONRECEIVED, false]
	])(
		'returns correct page (full appeal) for removal or variation of condition (%s) and householder permission conditions %s',
		(decision, householderPermissionConditions) => {
			const appeal = {
				typeOfPlanningApplication: REMOVAL_OR_VARIATION_OF_CONDITIONS,
				eligibility: {
					hasHouseholderPermissionConditions: householderPermissionConditions,
					applicationDecision: decision
				}
			};
			expect(getNextPageFromCanUseServicePage(appeal)).toEqual(fullAppealNextPage);
		}
	);

	it('returns correct page (listed building) for s20 application', () => {
		const appeal = {
			typeOfPlanningApplication: LISTED_BUILDING,
			eligibility: {}
		};
		expect(getNextPageFromCanUseServicePage(appeal)).toEqual(listedBuildingNextPage);
	});

	it.each([[FULL_APPEAL], [OUTLINE_PLANNING, RESERVED_MATTERS]])(
		'returns correct page (full appeal) for %s application',
		(applicationType) => {
			const appeal = {
				typeOfPlanningApplication: applicationType,
				eligibility: {}
			};
			expect(getNextPageFromCanUseServicePage(appeal)).toEqual(fullAppealNextPage);
		}
	);
});
