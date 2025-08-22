const { appealProcessRows } = require('./appeal-process-details-rows');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { caseTypeLPAQFactory } = require('./test-factory');

const hasLPAQData = caseTypeLPAQFactory(CASE_TYPES.HAS.processCode, 'appealProcess');
const casPlanningLPAQData = caseTypeLPAQFactory(
	CASE_TYPES.CAS_PLANNING.processCode,
	'appealProcess'
);
const s78LPAQData = caseTypeLPAQFactory(CASE_TYPES.S78.processCode, 'appealProcess');
const s20LPAQData = caseTypeLPAQFactory(CASE_TYPES.S20.processCode, 'appealProcess');

const expectedRowsHas = [
	{ title: 'Appeals near the site', value: 'Yes' },
	{ title: 'Appeal references', value: '00000001' },
	{ title: 'Extra conditions', value: 'Yes\nexample new conditions' }
];
const expectedRowsS78 = [
	{ title: 'Appeal procedure', value: 'Inquiry\ninquiry preference\nExpected duration: 6 days' },
	{ title: 'Appeals near the site', value: 'Yes' },
	{ title: 'Appeal references', value: '00000001' },
	{ title: 'Extra conditions', value: 'Yes\nexample new conditions' }
];

describe('appealProcessRows', () => {
	it.each([
		['HAS', hasLPAQData, expectedRowsHas],
		['CAS Planning', casPlanningLPAQData, expectedRowsHas],
		['S78', s78LPAQData, expectedRowsS78],
		['S20', s20LPAQData, expectedRowsS78]
	])(`should create correct rows for appeal type %s`, (_, caseData, expectedRows) => {
		const visibleRows = appealProcessRows(caseData)
			.filter((row) => row.condition(caseData))
			.map((visibleRow) => {
				return { title: visibleRow.keyText, value: visibleRow.valueText };
			});

		expect(visibleRows).toEqual(expectedRows);
	});

	it('should handle null values correctly', () => {
		const caseData = {
			newConditionDetails: null,
			relations: []
		};

		const rows = appealProcessRows(caseData);

		expect(rows.length).toEqual(4);
		expect(rows[0].keyText).toEqual('Appeal procedure');
		expect(rows[0].condition()).toEqual(false);

		expect(rows[1].keyText).toEqual('Appeals near the site');
		expect(rows[1].valueText).toEqual('No');
		expect(rows[1].condition()).toEqual(true);
		expect(rows[2].keyText).toEqual('Appeal references');
		expect(rows[2].condition()).toEqual(false);

		expect(rows[3].keyText).toEqual('Extra conditions');
		expect(rows[3].valueText).toEqual('No');
		expect(rows[3].condition()).toEqual(true);
	});

	it('should handle correctly if no fields/files exists', () => {
		const rows = appealProcessRows({});

		expect(rows.length).toEqual(4);
		expect(rows[0].condition()).toEqual(false);
		expect(rows[1].condition()).toEqual(true);
		expect(rows[1].valueText).toEqual('No');
		expect(rows[2].condition()).toEqual(false);
		expect(rows[3].condition()).toEqual(false);
	});
});
