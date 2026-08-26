const { APPLICATION_DECISION, TYPE_OF_PLANNING_APPLICATION } =
	require('@pins/business-rules').constants;
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	EXPEDITED_PART_1_CUTOFF_DATE,
	isS78ExpeditedPart1Eligible,
	isExpeditedAppealDate,
	isNonS78ExpeditedPart1Eligible,
	isExpeditedPart1Eligible
} = require('./is-expedited-part1-eligible');

describe('isS78ExpeditedPart1Eligible', () => {
	it.each([
		TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL,
		TYPE_OF_PLANNING_APPLICATION.OUTLINE_PLANNING,
		TYPE_OF_PLANNING_APPLICATION.RESERVED_MATTERS,
		TYPE_OF_PLANNING_APPLICATION.PERMISSION_IN_PRINCIPLE
	])('returns true for %s when the date is on the cutoff and the decision is granted', (type) => {
		expect(
			isS78ExpeditedPart1Eligible({
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
			isS78ExpeditedPart1Eligible({
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
			isS78ExpeditedPart1Eligible({
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
			isS78ExpeditedPart1Eligible({
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
			isS78ExpeditedPart1Eligible({
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.PRIOR_APPROVAL,
				applicationDate: '2026-04-01T00:00:00.000Z',
				eligibility: {
					applicationDecision: APPLICATION_DECISION.GRANTED
				}
			})
		).toBe(false);
	});

	describe('minor-commercial-development', () => {
		it('returns true when decision is GRANTED and date is on/after cutoff', () => {
			expect(
				isS78ExpeditedPart1Eligible({
					typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
					applicationDate: `${EXPEDITED_PART_1_CUTOFF_DATE}T00:00:00.000Z`,
					eligibility: {
						applicationDecision: APPLICATION_DECISION.GRANTED
					},
					appealTypeCode: 'S78'
				})
			).toBe(true);
		});

		it('returns false when decision is REFUSED', () => {
			expect(
				isS78ExpeditedPart1Eligible({
					typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
					applicationDate: `${EXPEDITED_PART_1_CUTOFF_DATE}T00:00:00.000Z`,
					eligibility: {
						applicationDecision: APPLICATION_DECISION.REFUSED
					},
					appealTypeCode: 'S78'
				})
			).toBe(false);
		});

		it('returns false when decision is GRANTED but date is before cutoff', () => {
			expect(
				isS78ExpeditedPart1Eligible({
					typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
					applicationDate: '2026-03-31T22:59:59.000Z',
					eligibility: {
						applicationDecision: APPLICATION_DECISION.GRANTED
					},
					appealTypeCode: 'S78'
				})
			).toBe(false);
		});
	});

	describe('householder-planning', () => {
		it('returns true when decision is GRANTED and date is on/after cutoff', () => {
			expect(
				isS78ExpeditedPart1Eligible({
					typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING,
					applicationDate: `${EXPEDITED_PART_1_CUTOFF_DATE}T00:00:00.000Z`,
					eligibility: {
						applicationDecision: APPLICATION_DECISION.GRANTED
					},
					appealTypeCode: 'S78'
				})
			).toBe(true);
		});

		it('returns false when decision is REFUSED', () => {
			expect(
				isS78ExpeditedPart1Eligible({
					typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING,
					applicationDate: `${EXPEDITED_PART_1_CUTOFF_DATE}T00:00:00.000Z`,
					eligibility: {
						applicationDecision: APPLICATION_DECISION.REFUSED
					},
					appealTypeCode: 'S78'
				})
			).toBe(false);
		});

		it('returns false when decision is GRANTED but date is before cutoff', () => {
			expect(
				isS78ExpeditedPart1Eligible({
					typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING,
					applicationDate: '2026-03-31T22:59:59.000Z',
					eligibility: {
						applicationDecision: APPLICATION_DECISION.GRANTED
					},
					appealTypeCode: 'S78'
				})
			).toBe(false);
		});
	});
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

describe('isNonS78ExpeditedPart1Eligible', () => {
	it.each([
		CASE_TYPES.HAS.processCode,
		CASE_TYPES.CAS_ADVERTS.processCode,
		CASE_TYPES.CAS_PLANNING.processCode
	])('returns true for %s on or after cutoff date', (appealTypeCode) => {
		expect(
			isNonS78ExpeditedPart1Eligible(
				appealTypeCode,
				`${EXPEDITED_PART_1_CUTOFF_DATE}T00:00:00.000Z`
			)
		).toBe(true);
		expect(isNonS78ExpeditedPart1Eligible(appealTypeCode, '2026-04-01T10:00:00.000Z')).toBe(true);
	});

	it.each([
		CASE_TYPES.HAS.processCode,
		CASE_TYPES.CAS_ADVERTS.processCode,
		CASE_TYPES.CAS_PLANNING.processCode
	])('returns false for %s before cutoff date', (appealTypeCode) => {
		expect(isNonS78ExpeditedPart1Eligible(appealTypeCode, '2026-03-31T22:59:59.000Z')).toBe(false);
	});

	it.each([
		CASE_TYPES.S78.processCode,
		CASE_TYPES.S20.processCode,
		CASE_TYPES.ADVERTS.processCode,
		CASE_TYPES.LDC.processCode,
		CASE_TYPES.ENFORCEMENT.processCode,
		CASE_TYPES.ENFORCEMENT_LISTED.processCode
	])(
		'returns false for unsupported appeal type %s even when date is after cutoff',
		(appealTypeCode) => {
			expect(isNonS78ExpeditedPart1Eligible(appealTypeCode, '2026-04-01T10:00:00.000Z')).toBe(
				false
			);
		}
	);

	it.each([undefined, null, ''])('returns false when appealTypeCode is %p', (appealTypeCode) => {
		expect(isNonS78ExpeditedPart1Eligible(appealTypeCode, '2026-04-01T10:00:00.000Z')).toBe(false);
	});

	it.each([undefined, null, 'not-a-date'])(
		'returns false when applicationDate is %p',
		(applicationDate) => {
			expect(isNonS78ExpeditedPart1Eligible(CASE_TYPES.HAS.processCode, applicationDate)).toBe(
				false
			);
		}
	);
});

describe('isExpeditedPart1Eligible', () => {
	it('returns true for eligible S78 appeal', () => {
		expect(
			isExpeditedPart1Eligible({
				appealTypeCode: CASE_TYPES.S78.processCode,
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL,
				applicationDate: '2026-04-01T10:00:00.000Z',
				applicationDecision: APPLICATION_DECISION.GRANTED
			})
		).toBe(true);
	});

	it('returns true for eligible non-S78 appeal (e.g. HAS)', () => {
		expect(
			isExpeditedPart1Eligible({
				appealTypeCode: CASE_TYPES.HAS.processCode,
				applicationDate: '2026-04-01T10:00:00.000Z'
			})
		).toBe(true);
	});

	it('returns false for S78 appeal with application date before cutoff', () => {
		expect(
			isExpeditedPart1Eligible({
				appealTypeCode: CASE_TYPES.S78.processCode,
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL,
				applicationDate: '2026-03-31T10:00:00.000Z',
				applicationDecision: APPLICATION_DECISION.GRANTED
			})
		).toBe(false);
	});

	it('returns false for non-S78 appeal with application date before cutoff', () => {
		expect(
			isExpeditedPart1Eligible({
				appealTypeCode: CASE_TYPES.HAS.processCode,
				applicationDate: '2026-03-31T10:00:00.000Z'
			})
		).toBe(false);
	});

	it.each([undefined, null])('returns false when caseData is %p', (caseData) => {
		expect(isExpeditedPart1Eligible(caseData)).toBe(false);
	});
});
