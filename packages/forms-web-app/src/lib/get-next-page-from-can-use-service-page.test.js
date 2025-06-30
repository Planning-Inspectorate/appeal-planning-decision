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
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

const { getNextPageFromCanUseServicePage } = require('./get-next-page-from-can-use-service-page');

const householderNextPage = '/appeal-householder-decision/email-address';
const fullAppealNextPage = '/full-appeal/submit-appeal/email-address';
const listedBuildingNextPage = '/listed-building/email-address';

jest.mock('../../src/lib/is-lpa-in-feature-flag.js');

describe('getNextPageFromCanUseServicePage', () => {
	beforeEach(() => {
		isLpaInFeatureFlag.mockReturnValue(true);
	});

	it('returns correct page (householder) for householder application- refused', async () => {
		const appeal = {
			typeOfPlanningApplication: HOUSEHOLDER_PLANNING,
			eligibility: {
				applicationDecision: REFUSED
			}
		};
		const result = await getNextPageFromCanUseServicePage(appeal);
		expect(result).toEqual(householderNextPage);
	});
	it('returns correct page (full appeal) for householder application- granted', async () => {
		const appeal = {
			typeOfPlanningApplication: HOUSEHOLDER_PLANNING,
			eligibility: {
				applicationDecision: GRANTED
			}
		};
		expect(await getNextPageFromCanUseServicePage(appeal)).toEqual(fullAppealNextPage);
	});

	it('returns correct page (full appeal) for householder application - no decision received', async () => {
		const appeal = {
			typeOfPlanningApplication: HOUSEHOLDER_PLANNING,
			eligibility: {
				applicationDecision: NODECISIONRECEIVED
			}
		};
		expect(await getNextPageFromCanUseServicePage(appeal)).toEqual(fullAppealNextPage);
	});
	it.each([
		[GRANTED, true],
		[GRANTED, false],
		[REFUSED, false],
		[NODECISIONRECEIVED, true],
		[NODECISIONRECEIVED, false]
	])(
		'returns correct page (full appeal) for prior approval application %s where prior approval for existing home is %s ',
		async (decision, existingHome) => {
			const appeal = {
				typeOfPlanningApplication: PRIOR_APPROVAL,
				eligibility: {
					applicationDecision: decision,
					hasPriorApprovalForExistingHome: existingHome
				}
			};
			expect(await getNextPageFromCanUseServicePage(appeal)).toEqual(fullAppealNextPage);
		}
	);
	it('returns correct page (householder appeal) for prior approval - refused householder', async () => {
		const appeal = {
			typeOfPlanningApplication: PRIOR_APPROVAL,
			eligibility: {
				applicationDecision: REFUSED,
				hasPriorApprovalForExistingHome: true
			}
		};
		expect(await getNextPageFromCanUseServicePage(appeal)).toEqual(householderNextPage);
	});

	it('returns correct page (listed building if removal or variation of conditions application and s20 appeal type', async () => {
		const appeal = {
			appealType: APPEAL_ID.PLANNING_LISTED_BUILDING,
			typeOfPlanningApplication: REMOVAL_OR_VARIATION_OF_CONDITIONS,
			eligibility: {}
		};
		expect(await getNextPageFromCanUseServicePage(appeal)).toEqual(listedBuildingNextPage);
	});

	it('returns correct page (householder) if removal or variation of conditions (refused) and householder permission conditions true', async () => {
		const appeal = {
			typeOfPlanningApplication: REMOVAL_OR_VARIATION_OF_CONDITIONS,
			eligibility: {
				hasHouseholderPermissionConditions: true,
				applicationDecision: REFUSED
			}
		};
		expect(await getNextPageFromCanUseServicePage(appeal)).toEqual(householderNextPage);
	});

	it.each([
		[GRANTED, true],
		[GRANTED, false],
		[REFUSED, false],
		[NODECISIONRECEIVED, true],
		[NODECISIONRECEIVED, false]
	])(
		'returns correct page (full appeal) for removal or variation of condition (%s) and householder permission conditions %s',
		async (decision, householderPermissionConditions) => {
			const appeal = {
				typeOfPlanningApplication: REMOVAL_OR_VARIATION_OF_CONDITIONS,
				eligibility: {
					hasHouseholderPermissionConditions: householderPermissionConditions,
					applicationDecision: decision
				}
			};
			expect(await getNextPageFromCanUseServicePage(appeal)).toEqual(fullAppealNextPage);
		}
	);

	it('returns correct page (listed building) for s20 application', async () => {
		const appeal = {
			typeOfPlanningApplication: LISTED_BUILDING,
			eligibility: {}
		};
		expect(await getNextPageFromCanUseServicePage(appeal)).toEqual(listedBuildingNextPage);
	});

	it.each([[FULL_APPEAL], [OUTLINE_PLANNING, RESERVED_MATTERS]])(
		'returns correct page (full appeal) for %s application',
		async (applicationType) => {
			const appeal = {
				typeOfPlanningApplication: applicationType,
				eligibility: {}
			};
			expect(await getNextPageFromCanUseServicePage(appeal)).toEqual(fullAppealNextPage);
		}
	);
});
