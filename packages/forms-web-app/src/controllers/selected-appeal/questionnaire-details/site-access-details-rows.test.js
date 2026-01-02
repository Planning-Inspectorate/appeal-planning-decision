const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { caseTypeLPAQFactory } = require('./test-factory');
const { siteAccessRows } = require('./site-access-details-rows');

describe('siteAccessRows', () => {
	const caseData = caseTypeLPAQFactory(CASE_TYPES.HAS.processCode, 'siteAccess');

	const expectedRows = [
		{
			title: 'Will the inspector need access to the appellant’s land or property?',
			value: 'Yes'
		},
		{
			title: 'Reason for Inspector access',
			value: 'access details from LPA'
		},
		{
			title: 'Will the inspector need to enter a neighbour’s land or property?',
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
			'Will the inspector need access to the appellant’s land or property?'
		);
		expect(rows[0].valueText).toEqual('No');

		expect(rows[1].condition()).toEqual(false);

		expect(rows[2].condition()).toEqual(true);
		expect(rows[2].keyText).toEqual(
			'Will the inspector need to enter a neighbour’s land or property?'
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

	it('should set neighbourAddressesArray to empty array if undefined', () => {
		const caseData = {};
		const rows = require('./site-access-details-rows').siteAccessRows(caseData);
		// neighbourAddressesArray is used for extra rows, so only 5 default rows should exist
		expect(rows.length).toBe(5);
	});

	it('should set accessForInspectionBool correctly', () => {
		const caseDataTrue = { siteAccessDetails: ['', 'some value'] };
		const caseDataFalse = { siteAccessDetails: ['', ''] };
		const { siteAccessRows } = require('./site-access-details-rows');
		const rowsTrue = siteAccessRows(caseDataTrue);
		const rowsFalse = siteAccessRows(caseDataFalse);

		expect(rowsTrue[0].valueText).toBe('Yes');
		expect(rowsFalse[0].valueText).toBe('No');
	});

	it('should set hasNeighbourAddressesField correctly', () => {
		const caseDataWithField = { NeighbouringAddresses: [] };
		const caseDataWithoutField = {};
		const { siteAccessRows } = require('./site-access-details-rows');
		const rowsWith = siteAccessRows(caseDataWithField);
		const rowsWithout = siteAccessRows(caseDataWithoutField);

		expect(rowsWith[2].condition()).toBe(true);
		expect(rowsWithout[2].condition()).toBe(false);
	});

	it('should set hasNeighboursText correctly', () => {
		const caseDataTrue = {
			NeighbouringAddresses: [{}],
			reasonForNeighbourVisits: 'visit reason'
		};
		const caseDataFalse = { NeighbouringAddresses: [{}] };
		const { siteAccessRows } = require('./site-access-details-rows');
		const rowsTrue = siteAccessRows(caseDataTrue);
		const rowsFalse = siteAccessRows(caseDataFalse);

		expect(rowsTrue[3].condition()).toBe(true);
		expect(rowsFalse[3].condition()).toBe(false);
	});
});
