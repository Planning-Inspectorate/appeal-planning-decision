const { isNotTransferred } = require('./filter-transferred-appeal');
const { APPEAL_CASE_STATUS } = require('@planning-inspectorate/data-model');

const date1 = new Date('2024-05-06T00:00:00.000Z');
const date2 = new Date('2024-05-04T00:00:00.000Z');

const transferredAppeal = {
	caseTransferredDate: date1,
	caseStatus: APPEAL_CASE_STATUS.TRANSFERRED
};
const transferredAppeal2 = {
	caseTransferredDate: date2,
	caseStatus: APPEAL_CASE_STATUS.TRANSFERRED
};
const notTransferred = { caseTransferredDate: null, caseStatus: APPEAL_CASE_STATUS.READY_TO_START };
const notTransferred2 = { caseTransferredDate: null, caseStatus: null };
const mismatchedData1 = { caseTransferredDate: null, caseStatus: APPEAL_CASE_STATUS.TRANSFERRED };
const mismatchedData2 = {
	caseTransferredDate: date2,
	caseStatus: APPEAL_CASE_STATUS.READY_TO_START
};

describe('isNotTransferred', () => {
	it('filters appeals that have both the transferred date set and status set to transferred', () => {
		const appeals = [transferredAppeal];
		const result = appeals.filter(isNotTransferred);
		expect(result).toEqual([]);
	});

	it('does not filter appeals that only have the transferred date set', () => {
		const appeals = [mismatchedData2];
		const result = appeals.filter(isNotTransferred);
		expect(result).toEqual([mismatchedData2]);
	});

	it('does not filter appeals that only have the status set to transferred', () => {
		const appeals = [mismatchedData1];
		const result = appeals.filter(isNotTransferred);
		expect(result).toEqual([mismatchedData1]);
	});

	it('does not filter appeals that are not transferred', () => {
		const appeals = [notTransferred, notTransferred2];
		const result = appeals.filter(isNotTransferred);
		expect(result).toEqual([notTransferred, notTransferred2]);
	});

	it('filters all appeals correctly', () => {
		const appeals = [
			transferredAppeal,
			notTransferred,
			mismatchedData1,
			transferredAppeal2,
			notTransferred2,
			mismatchedData2
		];
		const result = appeals.filter(isNotTransferred);
		expect(result).toEqual(
			expect.arrayContaining([notTransferred, notTransferred2, mismatchedData1, mismatchedData2])
		);
		expect(result).not.toEqual(expect.arrayContaining([transferredAppeal2, transferredAppeal]));
	});
});
