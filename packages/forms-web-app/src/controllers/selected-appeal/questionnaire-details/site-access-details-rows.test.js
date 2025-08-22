const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { caseTypeLPAQFactory } = require('./test-factory');
const { siteAccessRows } = require('./site-access-details-rows');

describe('siteAccessRows', () => {
	const caseData = caseTypeLPAQFactory(CASE_TYPES.HAS.processCode, 'siteAccess');

	const expectedRows = [
		{
			title: 'Might the inspector need access to the appellant’s land or property?',
			value: 'Yes'
		},
		{
			title: 'Reason for Inspector access',
			value: 'access details from LPA'
		},
		{
			title: 'Might the inspector need to enter a neighbour’s land or property?',
			value: 'Yes'
		},
		{
			title: 'Reason for Inspector visit',
			value: 'Reason for neighbour visits here'
		},
		{
			title: 'Potential safety risks',
			value: 'Yes\nlpa safety details for show'
		},
		{
			title: 'Neighbouring site 1',
			value: 'address 1 l1\naddress 1 l2\ntown\nab1 2cd'
		},
		{
			title: 'Neighbouring site 2',
			value: 'address 2 l1\naddress 2 l2\nanother town\nef3 4gh'
		}
	];
	it(`should create correct rows for appeal type %s`, () => {
		const visibleRows = siteAccessRows(caseData)
			.filter((row) => row.condition(caseData))
			.map((visibleRow) => {
				return { title: visibleRow.keyText, value: visibleRow.valueText };
			});
		expect(visibleRows).toEqual(expectedRows);
	});

	it('should handle false values correctly', () => {
		const caseData = {
			siteAccessDetails: ['', ''],
			siteSafetyDetails: ['', ''],
			NeighbouringAddresses: []
		};

		const rows = siteAccessRows(caseData);

		expect(rows.length).toEqual(5);

		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].keyText).toEqual(
			'Might the inspector need access to the appellant’s land or property?'
		);
		expect(rows[0].valueText).toEqual('No');

		expect(rows[1].condition()).toEqual(false);

		expect(rows[2].condition()).toEqual(true);
		expect(rows[2].keyText).toEqual(
			'Might the inspector need to enter a neighbour’s land or property?'
		);
		expect(rows[2].valueText).toEqual('No');

		expect(rows[3].condition()).toEqual(false);

		expect(rows[4].condition()).toEqual(true);
		expect(rows[4].keyText).toEqual('Potential safety risks');
		expect(rows[4].valueText).toEqual('No');
	});

	it('should set condition correctly if fields do not exist', () => {
		const rows = siteAccessRows({});

		expect(rows.length).toEqual(5);
		expect(rows[0].condition()).toEqual(true);
		expect(rows[1].condition()).toEqual(false);
		expect(rows[2].condition()).toEqual(false);
		expect(rows[3].condition()).toEqual(false);
		expect(rows[4].condition()).toEqual(true);
	});
});
