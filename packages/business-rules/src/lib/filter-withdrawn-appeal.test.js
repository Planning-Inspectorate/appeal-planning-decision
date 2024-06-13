const { isNotWithdrawn } = require('@pins/business-rules/src/lib/filter-withdrawn-appeal');

const date1 = new Date('2024-05-06T00:00:00.000Z');
const date2 = new Date('2024-05-04T00:00:00.000Z');

const withdrawnAppeal = { appealWithdrawnDate: date1, appealStatus: 'withdrawn' };
const withdrawnAppeal2 = { appealWithdrawnDate: date2, appealStatus: 'withdrawn' };
const notWithdrawn = { appealWithdrawnDate: null, appealStatus: 'ready_to_start' };
const notWithdrawn2 = { appealWithdrawnDate: null, appealStatus: null };
const mismatchedData1 = { appealWithdrawnDate: null, appealStatus: 'withdrawn' };
const mismatchedData2 = { appealWithdrawnDate: date2, appealStatus: 'ready_to_start' };

describe('isNotWithdrawn', () => {
	it('filters appeals that have both the date set and status set to withdrawn', () => {
		const appeals = [withdrawnAppeal];
		const result = appeals.filter(isNotWithdrawn);
		expect(result).toEqual([]);
	});

	it('does not filter appeals that only have the date set', () => {
		const appeals = [mismatchedData2];
		const result = appeals.filter(isNotWithdrawn);
		expect(result).toEqual([mismatchedData2]);
	});

	it('does not filter appeals that only have the ststus set to withdrawn', () => {
		const appeals = [mismatchedData1];
		const result = appeals.filter(isNotWithdrawn);
		expect(result).toEqual([mismatchedData1]);
	});

	it('does not filter appeals that are not withdrawn', () => {
		const appeals = [notWithdrawn, notWithdrawn2];
		const result = appeals.filter(isNotWithdrawn);
		expect(result).toEqual([notWithdrawn, notWithdrawn2]);
	});

	it('filters all appeals correctly', () => {
		const appeals = [
			withdrawnAppeal,
			notWithdrawn,
			mismatchedData1,
			withdrawnAppeal2,
			notWithdrawn2,
			mismatchedData2
		];
		const result = appeals.filter(isNotWithdrawn);
		expect(result).toEqual(
			expect.arrayContaining([notWithdrawn, notWithdrawn2, mismatchedData1, mismatchedData2])
		);
		expect(result).not.toEqual(expect.arrayContaining([withdrawnAppeal2, withdrawnAppeal]));
	});
});
