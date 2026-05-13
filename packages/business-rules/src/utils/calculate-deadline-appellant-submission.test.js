const {
	calculateDeadlineFromAppellantSubmission
} = require('./calculate-deadline-appellant-submission');
const { APPLICATION_DECISION } = require('../constants');

describe('calculateDeadlineFromAppellantSubmission', () => {
	describe('householder appeal', () => {
		it('calculates deadline from appellant submission', () => {
			const result = calculateDeadlineFromAppellantSubmission({
				appellantSubmission: {
					appealTypeCode: 'HAS',
					applicationDecisionDate: new Date('2020-10-20'),
					applicationDecision: APPLICATION_DECISION.REFUSED,
					isListedBuilding: null,
					enforcementEffectiveDate: null,
					hasContactedPlanningInspectorate: null
				}
			});

			expect(result).toBeInstanceOf(Date);
			expect(result.toISOString()).toEqual('2021-01-12T23:59:59.999Z');
		});

		it('returns null when decisionDate is null', () => {
			const result = calculateDeadlineFromAppellantSubmission({
				appellantSubmission: {
					appealTypeCode: 'HAS',
					applicationDecisionDate: null,
					applicationDecision: APPLICATION_DECISION.REFUSED,
					isListedBuilding: null,
					enforcementEffectiveDate: null,
					hasContactedPlanningInspectorate: null
				}
			});

			expect(result).toBeNull();
		});
	});

	describe('LDC appeal', () => {
		it('returns null for non-listed building LDC', () => {
			const result = calculateDeadlineFromAppellantSubmission({
				appellantSubmission: {
					appealTypeCode: 'LDC',
					applicationDecisionDate: new Date('2020-10-20'),
					applicationDecision: APPLICATION_DECISION.REFUSED,
					isListedBuilding: false,
					enforcementEffectiveDate: null,
					hasContactedPlanningInspectorate: null
				}
			});

			expect(result).toBeNull();
		});

		it('returns null for non-listed LDC with null isListedBuilding', () => {
			const result = calculateDeadlineFromAppellantSubmission({
				appellantSubmission: {
					appealTypeCode: 'LDC',
					applicationDecisionDate: new Date('2020-10-20'),
					applicationDecision: APPLICATION_DECISION.REFUSED,
					isListedBuilding: null,
					enforcementEffectiveDate: null,
					hasContactedPlanningInspectorate: null
				}
			});

			expect(result).toBeNull();
		});

		it('calculates deadline for listed building LDC (S26H)', () => {
			const result = calculateDeadlineFromAppellantSubmission({
				appellantSubmission: {
					appealTypeCode: 'LDC',
					applicationDecisionDate: new Date('2020-10-20'),
					applicationDecision: APPLICATION_DECISION.REFUSED,
					isListedBuilding: true,
					enforcementEffectiveDate: null,
					hasContactedPlanningInspectorate: null
				}
			});

			expect(result).toBeInstanceOf(Date);
			expect(result.toISOString()).toEqual('2021-04-20T22:59:59.999Z');
		});
	});

	describe('enforcement appeal', () => {
		it('calculates deadline from enforcement effective date when contacted PINs', () => {
			const result = calculateDeadlineFromAppellantSubmission({
				appellantSubmission: {
					appealTypeCode: 'ENFORCEMENT',
					applicationDecisionDate: null,
					applicationDecision: null,
					isListedBuilding: null,
					enforcementEffectiveDate: '2020-10-20T00:00:00.000Z',
					hasContactedPlanningInspectorate: true
				}
			});

			expect(result).toBeInstanceOf(Date);
		});

		it('returns null when enforcement effective date is null', () => {
			const result = calculateDeadlineFromAppellantSubmission({
				appellantSubmission: {
					appealTypeCode: 'ENFORCEMENT',
					applicationDecisionDate: null,
					applicationDecision: null,
					isListedBuilding: null,
					enforcementEffectiveDate: null,
					hasContactedPlanningInspectorate: null
				}
			});

			expect(result).toBeNull();
		});
	});

	describe('enforcement listed building appeal', () => {
		it('calculates deadline from enforcement effective date', () => {
			const result = calculateDeadlineFromAppellantSubmission({
				appellantSubmission: {
					appealTypeCode: 'ENFORCEMENT_LISTED',
					applicationDecisionDate: null,
					applicationDecision: null,
					isListedBuilding: null,
					enforcementEffectiveDate: '2020-10-20T00:00:00.000Z',
					hasContactedPlanningInspectorate: false
				}
			});

			expect(result).toBeInstanceOf(Date);
		});
	});

	describe('S78 appeal', () => {
		it('calculates 6 month deadline', () => {
			const result = calculateDeadlineFromAppellantSubmission({
				appellantSubmission: {
					appealTypeCode: 'S78',
					applicationDecisionDate: new Date('2020-01-01'),
					applicationDecision: APPLICATION_DECISION.REFUSED,
					isListedBuilding: null,
					enforcementEffectiveDate: null,
					hasContactedPlanningInspectorate: null
				}
			});

			expect(result).toBeInstanceOf(Date);
			expect(result.toISOString()).toEqual('2020-07-01T22:59:59.999Z');
		});
	});
});
