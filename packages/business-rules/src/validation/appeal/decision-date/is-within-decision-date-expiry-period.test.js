const { subWeeks, subDays, add } = require('date-fns');
const isWithinDecisionDateExpiryPeriod = require('./is-within-decision-date-expiry-period');
const { APPEAL_ID, APPLICATION_DECISION } = require('../../../constants');
const { appeal } = require('../../../config');

describe('validation/appeal/decision-date/is-within-decision-date-expiry-period', () => {
	let currentDate;

	beforeEach(() => {
		currentDate = new Date();
	});

	it('should throw if now is invalid', () => {
		expect(() =>
			isWithinDecisionDateExpiryPeriod({
				givenDate: new Date(),
				appealType: APPEAL_ID.HOUSEHOLDER,
				applicationDecision: APPLICATION_DECISION.REFUSED,
				now: null
			})
		).toThrow('The given date must be a valid Date instance');
	});

	it('should return true if the current date is before the deadline date', () => {
		expect(
			isWithinDecisionDateExpiryPeriod({
				givenDate: currentDate,
				appealType: APPEAL_ID.HOUSEHOLDER,
				applicationDecision: APPLICATION_DECISION.REFUSED,
				now: currentDate
			})
		).toBeTruthy();
	});

	it('should return false if the current date is after the deadline date', () => {
		expect(
			isWithinDecisionDateExpiryPeriod({
				givenDate: subWeeks(currentDate, 15),
				appealType: APPEAL_ID.HOUSEHOLDER,
				applicationDecision: APPLICATION_DECISION.REFUSED,
				now: currentDate
			})
		).toBeFalsy();
	});

	it('should return true when deadlineDate is null (no deadline)', () => {
		expect(
			isWithinDecisionDateExpiryPeriod({
				givenDate: null,
				appealType: APPEAL_ID.LAWFUL_DEVELOPMENT_CERTIFICATE,
				applicationDecision: APPLICATION_DECISION.REFUSED,
				now: currentDate
			})
		).toBeTruthy();
	});

	it('should return true when appealType is null (no deadline)', () => {
		expect(
			isWithinDecisionDateExpiryPeriod({
				givenDate: currentDate,
				appealType: null,
				applicationDecision: APPLICATION_DECISION.REFUSED,
				now: currentDate
			})
		).toBeTruthy();
	});

	describe('if decision date is 12 weeks ago from today then it...', () => {
		const decisionDate = subDays(
			new Date(),
			appeal.type[APPEAL_ID.HOUSEHOLDER].appealDue.refused?.time
		);

		it('should return true if today is before deadline date', () => {
			expect(
				isWithinDecisionDateExpiryPeriod({
					givenDate: decisionDate,
					appealType: APPEAL_ID.HOUSEHOLDER,
					applicationDecision: APPLICATION_DECISION.REFUSED
				})
			).toBeTruthy();
		});

		it('should return false if tomorrow is after deadline date', () => {
			const tomorrow = add(currentDate, {
				days: 1
			});
			expect(
				isWithinDecisionDateExpiryPeriod({
					givenDate: decisionDate,
					appealType: APPEAL_ID.HOUSEHOLDER,
					applicationDecision: APPLICATION_DECISION.REFUSED,
					now: tomorrow
				})
			).toBeFalsy();
		});
	});
});
