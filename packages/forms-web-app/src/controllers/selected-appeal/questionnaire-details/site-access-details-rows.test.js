const { siteAccessRows } = require('./site-access-details-rows');

describe('siteAccessRows', () => {
	it('should create rows with correct data if relevant case data fields exist & field values populated', () => {
		const caseData = {
			siteAccessDetails: ['appellant access details do not show', 'lpa access details for show'],
			siteSafetyDetails: ['appellant safety details do not show', 'lpa safety details for show'],
			reasonForNeighbourVisits: 'some neighbouring site access details',
			NeighbouringAddresses: [
				{
					addressLine1: 'address 1 l1',
					addressLine2: 'address 1 l2',
					townCity: 'town',
					postcode: 'ab1 2cd'
				},
				{
					addressLine1: 'address 2 l1',
					addressLine2: 'address 2 l2',
					townCity: 'another town',
					postcode: 'ef3 4gh'
				}
			]
		};

		const rows = siteAccessRows(caseData);

		expect(rows.length).toEqual(7);

		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].keyText).toEqual('Access for inspection');
		expect(rows[0].valueText).toEqual('Yes');

		expect(rows[1].condition()).toEqual(true);
		expect(rows[1].keyText).toEqual('Reason for Inspector access');
		expect(rows[1].valueText).toEqual('lpa access details for show');

		expect(rows[2].condition()).toEqual(true);
		expect(rows[2].keyText).toEqual('Inspector visit to neighbour');
		expect(rows[2].valueText).toEqual('Yes');

		expect(rows[3].condition()).toEqual(true);
		expect(rows[3].keyText).toEqual('Reason for Inspector visit');
		expect(rows[3].valueText).toEqual('some neighbouring site access details');

		expect(rows[4].condition()).toEqual(true);
		expect(rows[4].keyText).toEqual('Neighbouring site 1');
		expect(rows[4].valueText).toEqual('address 1 l1\naddress 1 l2\ntown\nab1 2cd');

		expect(rows[5].condition()).toEqual(true);
		expect(rows[5].keyText).toEqual('Neighbouring site 2');
		expect(rows[5].valueText).toEqual('address 2 l1\naddress 2 l2\nanother town\nef3 4gh');

		expect(rows[6].condition()).toEqual(true);
		expect(rows[6].keyText).toEqual('Potential safety risks');
		expect(rows[6].valueText).toEqual('Yes\nlpa safety details for show');
	});

	it('should handle site access and site safety rows correctly', () => {
		const caseData = {
			siteAccessDetails: ['', 'lpa access details'],
			siteSafetyDetails: ['', 'lpa safety details']
		};
		const rows = siteAccessRows(caseData);
		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].keyText).toEqual('Access for inspection');
		expect(rows[0].valueText).toEqual('Yes');

		expect(rows[1].condition()).toEqual(true);
		expect(rows[1].keyText).toEqual('Reason for Inspector access');
		expect(rows[1].valueText).toEqual('lpa access details');

		expect(rows[4].condition()).toEqual(true);
		expect(rows[4].keyText).toEqual('Potential safety risks');
		expect(rows[4].valueText).toEqual('Yes\nlpa safety details');
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
		expect(rows[0].keyText).toEqual('Access for inspection');
		expect(rows[0].valueText).toEqual('No');

		expect(rows[1].condition()).toEqual(false);

		expect(rows[2].condition()).toEqual(true);
		expect(rows[2].keyText).toEqual('Inspector visit to neighbour');
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
