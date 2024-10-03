const { formatInTimeZone } = require('date-fns-tz');

const { APPEAL_ID, APPLICATION_DECISION } = require('../../constants');
const BusinessRulesError = require('../../lib/business-rules-error');

const calculateAppealDeadline = require('./deadline-date');
const targetTimezone = 'Europe/London';

describe('calculateAppealDeadline', () => {
	it('throws a BusinessRulesError when the application decision is invalid', () => {
		const decisionDate = new Date('2020-10-20');
		const appealType = APPEAL_ID.HOUSEHOLDER;
		const applicationDecision = 'INVALID_DECISION';

		expect(() => {
			calculateAppealDeadline(decisionDate, appealType, applicationDecision);
		}).toThrow(BusinessRulesError);
	});

	it('throws a BusinessRulesError when the decision date is invalid', () => {
		const decisionDate = 'abc'; // Invalid date format
		const appealType = APPEAL_ID.HOUSEHOLDER;
		const applicationDecision = APPLICATION_DECISION.APPROVED;

		expect(() => {
			calculateAppealDeadline(decisionDate, appealType, applicationDecision);
		}).toThrow(BusinessRulesError);
	});

	it('throws a BusinessRulesError when the appeal type is invalid', () => {
		const decisionDate = new Date('2020-10-20');
		const appealType = 'INVALID_TYPE';
		const applicationDecision = APPLICATION_DECISION.APPROVED;

		expect(() => {
			calculateAppealDeadline(decisionDate, appealType, applicationDecision);
		}).toThrow(BusinessRulesError);
	});

	it('calculates the appeal deadline for a valid decision date, appeal type, and application decision', () => {
		const decisionDate = new Date('2020-10-20');
		const appealType = APPEAL_ID.HOUSEHOLDER;
		const applicationDecision = APPLICATION_DECISION.APPROVED;

		const result = calculateAppealDeadline(decisionDate, appealType, applicationDecision);

		expect(result.toISOString()).toEqual('2021-01-12T23:59:59.999Z');
	});

	it('calculates the appeal deadline with default values when optional arguments are not provided', () => {
		const decisionDate = new Date('2023-10-20');

		const result = calculateAppealDeadline(decisionDate);

		expect(result.toISOString()).toEqual('2024-01-12T23:59:59.999Z');
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
			const result = calculateAppealDeadline(input, APPEAL_ID.PLANNING_SECTION_78);
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
			const result = calculateAppealDeadline(input, APPEAL_ID.PLANNING_SECTION_78);
			expect(result.toISOString()).toEqual(expected);
			expect(formatInTimeZone(result, targetTimezone, 'HH:mm:ss')).toEqual('23:59:59');
		}
	);
});
