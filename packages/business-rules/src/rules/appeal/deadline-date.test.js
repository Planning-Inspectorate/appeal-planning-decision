const { formatInTimeZone } = require('date-fns-tz');

const { APPEAL_ID, APPLICATION_DECISION } = require('../../constants');
const BusinessRulesError = require('../../lib/business-rules-error');

const calculateAppealDeadline = require('./deadline-date');
const targetTimezone = 'Europe/London';

describe('calculateAppealDeadline', () => {
	it('throws a BusinessRulesError when the application decision is invalid', () => {
		expect(() => {
			calculateAppealDeadline({
				decisionDate: new Date('2020-10-20'),
				appealType: APPEAL_ID.HOUSEHOLDER,
				applicationDecision: 'INVALID_DECISION'
			});
		}).toThrow(BusinessRulesError);
	});

	it('throws a BusinessRulesError when the decision date is invalid', () => {
		expect(() => {
			calculateAppealDeadline({
				decisionDate: 'abc',
				appealType: APPEAL_ID.HOUSEHOLDER,
				applicationDecision: APPLICATION_DECISION.APPROVED
			});
		}).toThrow(BusinessRulesError);
	});

	it('throws a BusinessRulesError when the appeal type is invalid', () => {
		expect(() => {
			calculateAppealDeadline({
				decisionDate: new Date('2020-10-20'),
				appealType: 'INVALID_TYPE',
				applicationDecision: APPLICATION_DECISION.APPROVED
			});
		}).toThrow(BusinessRulesError);
	});

	it('calculates the appeal deadline for a valid decision date, appeal type, and application decision', () => {
		const result = calculateAppealDeadline({
			decisionDate: new Date('2020-10-20'),
			appealType: APPEAL_ID.HOUSEHOLDER,
			applicationDecision: APPLICATION_DECISION.APPROVED
		});

		expect(result.toISOString()).toEqual('2021-01-12T23:59:59.999Z');
	});

	it('defaults applicationDecision to refused when null', () => {
		const result = calculateAppealDeadline({
			decisionDate: new Date('2023-10-20'),
			appealType: APPEAL_ID.HOUSEHOLDER,
			applicationDecision: null
		});

		expect(result.toISOString()).toEqual('2024-01-12T23:59:59.999Z');
	});

	it('returns null when appealType is null', () => {
		const result = calculateAppealDeadline({
			decisionDate: new Date('2020-10-20'),
			appealType: null,
			applicationDecision: APPLICATION_DECISION.REFUSED
		});

		expect(result).toBeNull();
	});

	it('returns null when decisionDate is null', () => {
		const result = calculateAppealDeadline({
			decisionDate: null,
			appealType: APPEAL_ID.HOUSEHOLDER,
			applicationDecision: APPLICATION_DECISION.REFUSED
		});

		expect(result).toBeNull();
	});

	it('parses string decisionDate via parseISO', () => {
		const result = calculateAppealDeadline({
			decisionDate: '2020-10-20',
			appealType: APPEAL_ID.HOUSEHOLDER,
			applicationDecision: APPLICATION_DECISION.REFUSED
		});

		expect(result).toBeInstanceOf(Date);
		expect(result.toISOString()).toEqual('2021-01-12T23:59:59.999Z');
	});

	describe('LDC appeal type', () => {
		it('returns null when isListedBuilding is undefined (non-listed LDC)', () => {
			const result = calculateAppealDeadline({
				decisionDate: new Date('2020-10-20'),
				appealType: APPEAL_ID.LAWFUL_DEVELOPMENT_CERTIFICATE,
				applicationDecision: APPLICATION_DECISION.REFUSED
			});

			expect(result).toBeNull();
		});

		it('returns null when isListedBuilding is false', () => {
			const result = calculateAppealDeadline({
				decisionDate: new Date('2020-10-20'),
				appealType: APPEAL_ID.LAWFUL_DEVELOPMENT_CERTIFICATE,
				applicationDecision: APPLICATION_DECISION.REFUSED,
				isListedBuilding: false
			});

			expect(result).toBeNull();
		});

		it('calculates deadline when isListedBuilding is true', () => {
			const result = calculateAppealDeadline({
				decisionDate: new Date('2020-10-20'),
				appealType: APPEAL_ID.LAWFUL_DEVELOPMENT_CERTIFICATE,
				applicationDecision: APPLICATION_DECISION.REFUSED,
				isListedBuilding: true
			});

			expect(result).toBeInstanceOf(Date);
			expect(result.toISOString()).toEqual('2021-04-20T22:59:59.999Z');
		});
	});

	describe('enforcement appeal types', () => {
		it('returns null for enforcement notice when no effective date', () => {
			const result = calculateAppealDeadline({
				appealType: APPEAL_ID.ENFORCEMENT_NOTICE,
				enforcementEffectiveDate: null
			});

			expect(result).toBeNull();
		});

		it('returns deadline +6 days for enforcement notice when contacted PINs', () => {
			const result = calculateAppealDeadline({
				appealType: APPEAL_ID.ENFORCEMENT_NOTICE,
				enforcementEffectiveDate: '2020-10-20T00:00:00.000Z',
				hasContactedPlanningInspectorate: true
			});

			expect(result).toBeInstanceOf(Date);
			expect(formatInTimeZone(result, targetTimezone, 'yyyy-MM-dd HH:mm:ss')).toEqual(
				'2020-10-26 23:59:59'
			);
		});

		it('returns deadline -1 day for enforcement notice when not contacted PINs', () => {
			const result = calculateAppealDeadline({
				appealType: APPEAL_ID.ENFORCEMENT_NOTICE,
				enforcementEffectiveDate: '2020-10-20T00:00:00.000Z',
				hasContactedPlanningInspectorate: false
			});

			expect(result).toBeInstanceOf(Date);
			expect(formatInTimeZone(result, targetTimezone, 'yyyy-MM-dd HH:mm:ss')).toEqual(
				'2020-10-19 23:59:59'
			);
		});

		it('returns null for enforcement listed building when no effective date', () => {
			const result = calculateAppealDeadline({
				appealType: APPEAL_ID.ENFORCEMENT_LISTED_BUILDING,
				enforcementEffectiveDate: null
			});

			expect(result).toBeNull();
		});

		it('handles enforcement with Date object for effective date', () => {
			const result = calculateAppealDeadline({
				appealType: APPEAL_ID.ENFORCEMENT_NOTICE,
				enforcementEffectiveDate: new Date('2020-10-20T00:00:00.000Z'),
				hasContactedPlanningInspectorate: true
			});

			expect(result).toBeInstanceOf(Date);
		});
	});

	const s78TestCases = [
		{ input: new Date('2020-01-01T00:00:00.000Z'), expected: '2020-07-01T22:59:59.999Z' }, // 01 Jan > 01 July
		{ input: new Date('2020-03-31T00:00:00.000Z'), expected: '2020-09-30T22:59:59.999Z' }, // 31 March > 30 Sep
		{ input: new Date('2020-05-31T00:00:00.000Z'), expected: '2020-11-30T23:59:59.999Z' }, // 31 May > 30 Nov
		{ input: new Date('2020-08-31T00:00:00.000Z'), expected: '2021-02-28T23:59:59.999Z' }, // 29 Aug > 28 Feb
		{ input: new Date('2020-08-31T00:00:00.000Z'), expected: '2021-02-28T23:59:59.999Z' }, // 30 Aug > 28 Feb
		{ input: new Date('2020-08-31T00:00:00.000Z'), expected: '2021-02-28T23:59:59.999Z' }, // 31 Aug > 28 Feb
		{ input: new Date('2019-08-31T00:00:00.000Z'), expected: '2020-02-29T23:59:59.999Z' }, // 31 Aug > 29 Feb leap year
		{ input: new Date('2019-08-31T00:00:00.000Z'), expected: '2020-02-29T23:59:59.999Z' }, // 31 Aug > 29 Feb leap year
		{ input: new Date('2019-08-31T00:00:00.000Z'), expected: '2020-02-29T23:59:59.999Z' }, // 31 Aug > 29 Feb leap year
		{ input: new Date('2020-10-31T00:00:00.000Z'), expected: '2021-04-30T22:59:59.999Z' }, // 31 Oct > 30 April
		{ input: new Date('2020-12-31T00:00:00.000Z'), expected: '2021-06-30T22:59:59.999Z' } // 31 Dec > 30 June
	];

	it.each(s78TestCases)(
		'PLANNING_SECTION_78 should add 6 months: $input should return $expected',
		({ input, expected }) => {
			const result = calculateAppealDeadline({
				decisionDate: input,
				appealType: APPEAL_ID.PLANNING_SECTION_78
			});
			expect(result.toISOString()).toEqual(expected);
			expect(formatInTimeZone(result, targetTimezone, 'HH:mm:ss')).toEqual('23:59:59');
		}
	);

	const s78RolloverTestCases = [
		{ input: new Date('2020-01-01T23:59:59.999Z'), expected: '2020-07-01T22:59:59.999Z' }, // input at end of day in utc will remain the same
		{ input: new Date('2020-05-31T23:59:59.999Z'), expected: '2020-12-01T23:59:59.999Z' } // input at end of day in bst will roll over to next day as input is 2020-06-01 in UK time
	];

	it.each(s78RolloverTestCases)(
		'PLANNING_SECTION_78 would add 6 months and potentially rollover if times passed through are already at end of day: $input should return $expected',
		({ input, expected }) => {
			const result = calculateAppealDeadline({
				decisionDate: input,
				appealType: APPEAL_ID.PLANNING_SECTION_78
			});
			expect(result.toISOString()).toEqual(expected);
			expect(formatInTimeZone(result, targetTimezone, 'HH:mm:ss')).toEqual('23:59:59');
		}
	);
});
