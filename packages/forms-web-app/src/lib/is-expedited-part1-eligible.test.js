const { APPLICATION_DECISION, TYPE_OF_PLANNING_APPLICATION } =
	require('@pins/business-rules').constants;
const {
	EXPEDITED_PART_1_CUTOFF_DATE,
	isExpeditedPart1Eligible,
	isExpeditedAppealDate
} = require('./is-expedited-part1-eligible');

describe('isExpeditedPart1Eligible', () => {
	it.each([
		TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL,
		TYPE_OF_PLANNING_APPLICATION.OUTLINE_PLANNING,
		TYPE_OF_PLANNING_APPLICATION.RESERVED_MATTERS,
		TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING,
		TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT
	])('returns true for %s when the date is on the cutoff and the decision is granted', (type) => {
		expect(
			isExpeditedPart1Eligible({
				typeOfPlanningApplication: type,
				applicationDate: `${EXPEDITED_PART_1_CUTOFF_DATE}T00:00:00.000Z`,
				eligibility: {
					applicationDecision: APPLICATION_DECISION.GRANTED
				},
				appealTypeCode: 'S78'
			})
		).toBe(true);
	});

	it('returns true when the date is after the cutoff and the decision is refused', () => {
		expect(
			isExpeditedPart1Eligible({
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL,
				applicationDate: '2026-04-02T10:30:00.000Z',
				eligibility: {
					applicationDecision: APPLICATION_DECISION.REFUSED
				},
				appealTypeCode: 'S78'
			})
		).toBe(true);
	});

	it('returns false when the date is before the cutoff', () => {
		expect(
			isExpeditedPart1Eligible({
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL,
				applicationDate: '2026-03-31T22:59:59.000Z',
				eligibility: {
					applicationDecision: APPLICATION_DECISION.GRANTED
				}
			})
		).toBe(false);
	});

	it('returns false when the decision is not received', () => {
		expect(
			isExpeditedPart1Eligible({
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL,
				applicationDate: '2026-04-01T00:00:00.000Z',
				eligibility: {
					applicationDecision: APPLICATION_DECISION.NODECISIONRECEIVED
				}
			})
		).toBe(false);
	});

	it('returns false for unsupported planning application types', () => {
		expect(
			isExpeditedPart1Eligible({
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.PRIOR_APPROVAL,
				applicationDate: '2026-04-01T00:00:00.000Z',
				eligibility: {
					applicationDecision: APPLICATION_DECISION.GRANTED
				}
			})
		).toBe(false);
	});

	it.each([undefined, null, 'not-a-date'])(
		'returns false when the application date is %p',
		(applicationDate) => {
			expect(
				isExpeditedPart1Eligible({
					typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL,
					applicationDate,
					eligibility: {
						applicationDecision: APPLICATION_DECISION.GRANTED
					}
				})
			).toBe(false);
		}
	);
});

describe('isExpeditedAppealDate', () => {
	it('returns true when the date is on the cutoff', () => {
		expect(isExpeditedAppealDate('2026-04-01T00:00:00.000Z')).toBe(true);
	});

	it('returns true when the date is after the cutoff', () => {
		expect(isExpeditedAppealDate('2026-04-02T10:30:00.000Z')).toBe(true);
	});

	it('returns false when the date is before the cutoff', () => {
		expect(isExpeditedAppealDate('2026-03-30T12:00:00.000Z')).toBe(false);
	});

	it.each([undefined, null, 'not-a-date'])(
		'returns false when the application date is %p',
		(applicationDate) => {
			expect(isExpeditedAppealDate(applicationDate)).toBe(false);
		}
	);
});
