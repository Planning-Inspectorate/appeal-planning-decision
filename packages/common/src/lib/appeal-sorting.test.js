const { sortByDateFieldDesc } = require('./appeal-sorting');

describe('appealSorting', () => {
	describe('sortByDateFieldDesc', () => {
		/**
		 * @param {string} field
		 * @param {number} day
		 * @returns {Object<string, string>}
		 */
		function objWithDateField(field, day) {
			return {
				[field]: `2023-12-${day}T10:00Z`
			};
		}
		const tests = [
			{
				name: 'empty',
				field: 'empty',
				list: [],
				want: []
			},
			{
				name: 'all present',
				field: 'caseDecisionOutcomeDate',
				list: [
					objWithDateField('caseDecisionOutcomeDate', 15),
					objWithDateField('caseDecisionOutcomeDate', 20),
					objWithDateField('caseDecisionOutcomeDate', 18),
					objWithDateField('caseDecisionOutcomeDate', 12)
				],
				want: [
					objWithDateField('caseDecisionOutcomeDate', 20),
					objWithDateField('caseDecisionOutcomeDate', 18),
					objWithDateField('caseDecisionOutcomeDate', 15),
					objWithDateField('caseDecisionOutcomeDate', 12)
				]
			},
			{
				name: 'some missing',
				field: 'caseDecisionOutcomeDate',
				list: [
					objWithDateField('caseDecisionOutcomeDate', 15),
					{ case: 1 },
					objWithDateField('caseDecisionOutcomeDate', 18),
					objWithDateField('caseDecisionOutcomeDate', 12)
				],
				want: [
					objWithDateField('caseDecisionOutcomeDate', 18),
					objWithDateField('caseDecisionOutcomeDate', 15),
					objWithDateField('caseDecisionOutcomeDate', 12),
					{ case: 1 }
				]
			}
		];

		test.each(tests)('$name', ({ field, list, want }) => {
			const got = list.sort(sortByDateFieldDesc(field));
			expect(got).toEqual(want);
		});
	});
});
