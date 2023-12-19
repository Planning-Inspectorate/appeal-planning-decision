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
				field: 'caseDecisionDate',
				list: [
					objWithDateField('caseDecisionDate', 15),
					objWithDateField('caseDecisionDate', 20),
					objWithDateField('caseDecisionDate', 18),
					objWithDateField('caseDecisionDate', 12)
				],
				want: [
					objWithDateField('caseDecisionDate', 20),
					objWithDateField('caseDecisionDate', 18),
					objWithDateField('caseDecisionDate', 15),
					objWithDateField('caseDecisionDate', 12)
				]
			},
			{
				name: 'some missing',
				field: 'caseDecisionDate',
				list: [
					objWithDateField('caseDecisionDate', 15),
					{ case: 1 },
					objWithDateField('caseDecisionDate', 18),
					objWithDateField('caseDecisionDate', 12)
				],
				want: [
					objWithDateField('caseDecisionDate', 18),
					objWithDateField('caseDecisionDate', 15),
					objWithDateField('caseDecisionDate', 12),
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
