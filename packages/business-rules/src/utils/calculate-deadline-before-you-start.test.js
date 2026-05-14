const { calculateDeadlineFromBeforeYouStart } = require('./calculate-deadline-before-you-start');
const { APPEAL_ID, APPLICATION_DECISION } = require('../constants');

describe('calculateDeadlineFromBeforeYouStart', () => {
	describe('householder appeal', () => {
		it('calculates deadline from before-you-start appeal data', () => {
			const result = calculateDeadlineFromBeforeYouStart({
				appeal: {
					appealType: APPEAL_ID.HOUSEHOLDER,
					decisionDate: '2020-10-20T00:00:00.000Z',
					eligibility: {
						applicationDecision: APPLICATION_DECISION.REFUSED,
						isListedBuilding: undefined,
						enforcementEffectiveDate: null,
						hasContactedPlanningInspectorate: null
					}
				}
			});

			expect(result).toBeInstanceOf(Date);
			expect(result.toISOString()).toEqual('2021-01-12T23:59:59.999Z');
		});

		it('returns null when decisionDate is null', () => {
			const result = calculateDeadlineFromBeforeYouStart({
				appeal: {
					appealType: APPEAL_ID.HOUSEHOLDER,
					decisionDate: null,
					eligibility: {
						applicationDecision: APPLICATION_DECISION.REFUSED,
						isListedBuilding: undefined,
						enforcementEffectiveDate: null,
						hasContactedPlanningInspectorate: null
					}
				}
			});

			expect(result).toBeNull();
		});
	});

	describe('LDC appeal', () => {
		it('returns null for non-listed building LDC', () => {
			const result = calculateDeadlineFromBeforeYouStart({
				appeal: {
					appealType: APPEAL_ID.LAWFUL_DEVELOPMENT_CERTIFICATE,
					decisionDate: '2020-10-20T00:00:00.000Z',
					eligibility: {
						applicationDecision: APPLICATION_DECISION.REFUSED,
						isListedBuilding: undefined,
						enforcementEffectiveDate: null,
						hasContactedPlanningInspectorate: null
					}
				}
			});

			expect(result).toBeNull();
		});

		it('returns null when isListedBuilding is false', () => {
			const result = calculateDeadlineFromBeforeYouStart({
				appeal: {
					appealType: APPEAL_ID.LAWFUL_DEVELOPMENT_CERTIFICATE,
					decisionDate: '2020-10-20T00:00:00.000Z',
					eligibility: {
						applicationDecision: APPLICATION_DECISION.REFUSED,
						isListedBuilding: false,
						enforcementEffectiveDate: null,
						hasContactedPlanningInspectorate: null
					}
				}
			});

			expect(result).toBeNull();
		});

		it('calculates deadline when isListedBuilding is true', () => {
			const result = calculateDeadlineFromBeforeYouStart({
				appeal: {
					appealType: APPEAL_ID.LAWFUL_DEVELOPMENT_CERTIFICATE,
					decisionDate: '2020-10-20T00:00:00.000Z',
					eligibility: {
						applicationDecision: APPLICATION_DECISION.REFUSED,
						isListedBuilding: true,
						enforcementEffectiveDate: null,
						hasContactedPlanningInspectorate: null
					}
				}
			});

			expect(result).toBeInstanceOf(Date);
			expect(result.toISOString()).toEqual('2021-04-20T22:59:59.999Z');
		});
	});

	describe('enforcement appeal', () => {
		it('calculates deadline from enforcement effective date', () => {
			const result = calculateDeadlineFromBeforeYouStart({
				appeal: {
					appealType: APPEAL_ID.ENFORCEMENT_NOTICE,
					decisionDate: null,
					eligibility: {
						applicationDecision: null,
						isListedBuilding: undefined,
						enforcementEffectiveDate: '2020-10-20T00:00:00.000Z',
						hasContactedPlanningInspectorate: true
					}
				}
			});

			expect(result).toBeInstanceOf(Date);
		});

		it('returns null when enforcement effective date is null', () => {
			const result = calculateDeadlineFromBeforeYouStart({
				appeal: {
					appealType: APPEAL_ID.ENFORCEMENT_NOTICE,
					decisionDate: null,
					eligibility: {
						applicationDecision: null,
						isListedBuilding: undefined,
						enforcementEffectiveDate: null,
						hasContactedPlanningInspectorate: null
					}
				}
			});

			expect(result).toBeNull();
		});
	});

	describe('null appealType', () => {
		it('returns null', () => {
			const result = calculateDeadlineFromBeforeYouStart({
				appeal: {
					appealType: null,
					decisionDate: '2020-10-20T00:00:00.000Z',
					eligibility: {
						applicationDecision: APPLICATION_DECISION.REFUSED,
						isListedBuilding: undefined,
						enforcementEffectiveDate: null,
						hasContactedPlanningInspectorate: null
					}
				}
			});

			expect(result).toBeNull();
		});
	});

	describe('S78 appeal', () => {
		it('calculates 6 month deadline', () => {
			const result = calculateDeadlineFromBeforeYouStart({
				appeal: {
					appealType: APPEAL_ID.PLANNING_SECTION_78,
					decisionDate: '2020-01-01T00:00:00.000Z',
					eligibility: {
						applicationDecision: APPLICATION_DECISION.REFUSED,
						isListedBuilding: undefined,
						enforcementEffectiveDate: null,
						hasContactedPlanningInspectorate: null
					}
				}
			});

			expect(result).toBeInstanceOf(Date);
			expect(result.toISOString()).toEqual('2020-07-01T22:59:59.999Z');
		});
	});
});
