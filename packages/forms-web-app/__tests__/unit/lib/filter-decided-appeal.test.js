const { filterAppealsWithinGivenDate } = require('../../../src/lib/filter-decided-appeals');
const { subYears, addDays } = require('date-fns');

describe('filterAppealsByGivenDate', () => {
	const FIVE_YEARS_IN_MILLISECONDS = 5 * 365 * 24 * 60 * 60 * 1000;
	const ONE_YEAR_IN_MILLISECONDS = 365 * 24 * 60 * 60 * 1000;

	const sixMonthsAgo = subYears(new Date(), 0.5);
	const twoYearsAgo = subYears(new Date(), 2);
	const fourYearsAgo = subYears(new Date(), 4);
	const sixYearsAgo = subYears(new Date(), 6);
	const sevenYearsAgo = subYears(new Date(), 7);
	const fiveYearsTwoDaysBeforeCutoff = addDays(subYears(new Date(), 5), 2);

	it('should include appeals within the specified time frame (5 years)', () => {
		const recentAppeal = {
			caseDecisionOutcomeDate: twoYearsAgo
		};

		expect(
			filterAppealsWithinGivenDate(
				recentAppeal,
				'caseDecisionOutcomeDate',
				FIVE_YEARS_IN_MILLISECONDS
			)
		).toBe(true);
	});
	it('should exclude appeals older than the specified time frame (5 years)', () => {
		const oldAppeal = {
			caseDecisionOutcomeDate: sixYearsAgo
		};

		expect(
			filterAppealsWithinGivenDate(oldAppeal, 'caseDecisionOutcomeDate', FIVE_YEARS_IN_MILLISECONDS)
		).toBe(false);
	});
	it('should exclude appeals without the specified date field', () => {
		const appealWithoutDate = {
			caseDecisionOutcomeDate: null
		};

		expect(
			filterAppealsWithinGivenDate(
				appealWithoutDate,
				'caseDecisionOutcomeDate',
				FIVE_YEARS_IN_MILLISECONDS
			)
		).toBe(false);
	});
	it('should work with a different time frame (1 year)', () => {
		const recentAppeal = {
			caseDecisionOutcomeDate: sixMonthsAgo
		};

		expect(
			filterAppealsWithinGivenDate(
				recentAppeal,
				'caseDecisionOutcomeDate',
				ONE_YEAR_IN_MILLISECONDS
			)
		).toBe(true);
	});
	it('should exclude appeals older than 1 year using the given date field', () => {
		const oldAppeal = {
			caseDecisionOutcomeDate: twoYearsAgo
		};

		expect(
			filterAppealsWithinGivenDate(oldAppeal, 'caseDecisionOutcomeDate', ONE_YEAR_IN_MILLISECONDS)
		).toBe(false);
	});
	it('should handle filtering by a different date field', () => {
		const appealWithDifferentDate = {
			caseWithdrawnDate: fourYearsAgo
		};

		expect(
			filterAppealsWithinGivenDate(
				appealWithDifferentDate,
				'caseWithdrawnDate',
				FIVE_YEARS_IN_MILLISECONDS
			)
		).toBe(true);
	});
	it('should exclude appeals based on a different date field that is older than 5 years', () => {
		const appealWithDifferentDate = {
			caseWithdrawnDate: sevenYearsAgo
		};

		expect(
			filterAppealsWithinGivenDate(
				appealWithDifferentDate,
				'caseWithdrawnDate',
				FIVE_YEARS_IN_MILLISECONDS
			)
		).toBe(false);
	});
	it('should include appeals that are 2 days less than 5 years old', () => {
		const appealWithDifferentDate = {
			caseWithdrawnDate: fiveYearsTwoDaysBeforeCutoff
		};

		expect(
			filterAppealsWithinGivenDate(
				appealWithDifferentDate,
				'caseWithdrawnDate',
				FIVE_YEARS_IN_MILLISECONDS
			)
		).toBe(true);
	});
});
