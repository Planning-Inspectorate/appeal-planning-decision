const {
	getOpenAppeals,
	getClosedAppeals,
	sortByInterestedPartyRepsDueDate,
	sortByCaseReference,
	sortByCaseDecisionDate
} = require('./appeal-sorting');

describe('Appeal Sorting Functions', () => {
	const currentDate = new Date();
	const futureDate = new Date(currentDate);
	futureDate.setDate(currentDate.getDate() + 10);
	const pastDate = new Date(currentDate);
	pastDate.setDate(currentDate.getDate() - 10);

	const appeals = [
		{
			interestedPartyRepsDueDate: futureDate.toISOString(),
			caseReference: '4',
			caseDecisionOutcomeDate: futureDate.toISOString()
		},
		{
			interestedPartyRepsDueDate: pastDate.toISOString(),
			caseReference: '3',
			caseDecisionOutcomeDate: pastDate.toISOString()
		},
		{ interestedPartyRepsDueDate: null, caseReference: 2 },
		{ interestedPartyRepsDueDate: undefined, caseReference: 1 }
	];

	describe('getOpenAppeals', () => {
		it('should return appeals with interestedPartyRepsDueDate in the future', () => {
			const result = getOpenAppeals(appeals);
			expect(result).toEqual([appeals[0]]);
		});

		it('should return an empty array if no appeals have interestedPartyRepsDueDate in the future', () => {
			const result = getOpenAppeals([{ interestedPartyRepsDueDate: pastDate.toISOString() }]);
			expect(result).toEqual([]);
		});
	});

	describe('getClosedAppeals', () => {
		it('should return appeals with interestedPartyRepsDueDate in the past or not set', () => {
			const result = getClosedAppeals(appeals);
			expect(result).toEqual([appeals[1], appeals[2], appeals[3]]);
		});

		it('should return an empty array if all appeals have interestedPartyRepsDueDate in the future', () => {
			const result = getClosedAppeals([appeals[0]]);
			expect(result).toEqual([]);
		});
	});

	describe('sortByInterestedPartyRepsDueDate', () => {
		it('should sort appeals by interestedPartyRepsDueDate in descending order', () => {
			const result = [appeals[1], appeals[0]].sort(sortByInterestedPartyRepsDueDate);
			expect(result).toEqual([appeals[0], appeals[1]]);
		});
	});

	describe('sortByCaseReference', () => {
		it('should sort appeals by caseReference in ascending order', () => {
			const result = [appeals[0], appeals[1]].sort(sortByCaseReference);
			expect(result).toEqual([appeals[1], appeals[0]]);
		});
	});

	describe('sortByCaseDecisionDate', () => {
		it('should sort appeals by caseDecisionOutcomeDate in descending order', () => {
			const result = [appeals[1], appeals[0]].sort(sortByCaseDecisionDate);
			expect(result).toEqual([appeals[0], appeals[1]]);
		});
	});
});
