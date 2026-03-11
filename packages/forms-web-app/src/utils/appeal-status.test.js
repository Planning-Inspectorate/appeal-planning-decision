const { getAppealStatus } = require('./appeal-status');

describe('getAppealStatus', () => {
	it('should return "decided" when caseDecisionOutcomeDate is present', () => {
		const appeal = { caseDecisionOutcomeDate: '2023-01-01' };
		const result = getAppealStatus(appeal);
		expect(result).toBe('decided');
	});

	it('should return "open" when interestedPartyRepsDueDate is in the future', () => {
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 10);
		const appeal = { interestedPartyRepsDueDate: futureDate.toISOString() };
		const result = getAppealStatus(appeal);
		expect(result).toBe('open');
	});

	it('should return "open" when case is an non-enforcement child linked case', () => {
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 10);
		const appeal = {
			caseReference: 'testCaseRef',
			interestedPartyRepsDueDate: futureDate.toISOString(),
			linkedCases: [
				{
					childCaseReference: 'testCaseRef'
				}
			]
		};
		const result = getAppealStatus(appeal);
		expect(result).toBe('open');
	});

	it('should return "open" when case is an lead linked case', () => {
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 10);
		const appeal = {
			caseReference: 'testCaseRef',
			appealTypeCode: 'ENFORCEMENT',
			interestedPartyRepsDueDate: futureDate.toISOString(),
			linkedCases: [
				{
					childCaseReference: 'otherTestCaseRef',
					leadCaseReference: 'testCaseRef'
				}
			]
		};
		const result = getAppealStatus(appeal);
		expect(result).toBe('open');
	});

	it('should return "closed" when interestedPartyRepsDueDate is in the past', () => {
		const pastDate = new Date();
		pastDate.setDate(pastDate.getDate() - 10);
		const appeal = { interestedPartyRepsDueDate: pastDate.toISOString() };
		const result = getAppealStatus(appeal);
		expect(result).toBe('closed');
	});

	it('should return "closed" when no relevant dates are present', () => {
		const appeal = {};
		const result = getAppealStatus(appeal);
		expect(result).toBe('closed');
	});

	it('should return "closed" when case is an enforcement child linked case', () => {
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 10);
		const appeal = {
			caseReference: 'testCaseRef',
			appealTypeCode: 'ENFORCEMENT',
			interestedPartyRepsDueDate: futureDate.toISOString(),
			linkedCases: [
				{
					childCaseReference: 'testCaseRef'
				}
			]
		};
		const result = getAppealStatus(appeal);
		expect(result).toBe('closed');
	});
});
