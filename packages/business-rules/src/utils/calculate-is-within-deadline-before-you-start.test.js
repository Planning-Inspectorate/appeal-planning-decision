const {
	calculateWithinDeadlineFromBeforeYouStart
} = require('./calculate-is-within-deadline-before-you-start');
const { APPEAL_ID, APPLICATION_DECISION } = require('../constants');
const { subWeeks } = require('date-fns');

describe('calculateWithinDeadlineFromBeforeYouStart', () => {
	const now = new Date();

	it('returns true when within deadline period', () => {
		const result = calculateWithinDeadlineFromBeforeYouStart({
			appeal: {
				appealType: APPEAL_ID.HOUSEHOLDER,
				decisionDate: now.toISOString(),
				eligibility: {
					applicationDecision: APPLICATION_DECISION.REFUSED,
					isListedBuilding: undefined,
					enforcementEffectiveDate: null,
					hasContactedPlanningInspectorate: null
				}
			}
		});

		expect(result).toBe(true);
	});

	it('returns false when past deadline period', () => {
		const oldDate = subWeeks(now, 15);
		const result = calculateWithinDeadlineFromBeforeYouStart({
			appeal: {
				appealType: APPEAL_ID.HOUSEHOLDER,
				decisionDate: oldDate.toISOString(),
				eligibility: {
					applicationDecision: APPLICATION_DECISION.REFUSED,
					isListedBuilding: undefined,
					enforcementEffectiveDate: null,
					hasContactedPlanningInspectorate: null
				}
			}
		});

		expect(result).toBe(false);
	});

	it('returns true when no deadline (non-listed LDC)', () => {
		const result = calculateWithinDeadlineFromBeforeYouStart({
			appeal: {
				appealType: APPEAL_ID.LAWFUL_DEVELOPMENT_CERTIFICATE,
				decisionDate: '2020-01-01T00:00:00.000Z',
				eligibility: {
					applicationDecision: APPLICATION_DECISION.REFUSED,
					isListedBuilding: undefined,
					enforcementEffectiveDate: null,
					hasContactedPlanningInspectorate: null
				}
			}
		});

		expect(result).toBe(true);
	});

	it('returns true when appealType is null', () => {
		const result = calculateWithinDeadlineFromBeforeYouStart({
			appeal: {
				appealType: null,
				decisionDate: '2020-01-01T00:00:00.000Z',
				eligibility: {
					applicationDecision: APPLICATION_DECISION.REFUSED,
					isListedBuilding: undefined,
					enforcementEffectiveDate: null,
					hasContactedPlanningInspectorate: null
				}
			}
		});

		expect(result).toBe(true);
	});

	it('returns true when decisionDate is null', () => {
		const result = calculateWithinDeadlineFromBeforeYouStart({
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

		expect(result).toBe(true);
	});
});
