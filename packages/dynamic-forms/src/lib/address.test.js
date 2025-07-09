const Address = require('./address');

describe('Address', () => {
	it('creates an instance of an Address', () => {
		const params = {
			addressLine1: '1 The Street',
			addressLine2: 'Somewhere',
			townCity: 'A Town',
			county: 'The County',
			postcode: 'AB1 2CD'
		};

		const address = new Address(params);

		expect(address instanceof Address).toBeTruthy();
		expect(address.addressLine1).toBe(params.addressLine1);
		expect(address.addressLine2).toBe(params.addressLine2);
		expect(address.townCity).toBe(params.townCity);
		expect(address.county).toBe(params.county);
		expect(address.postcode).toBe(params.postcode);
	});

	it('allows addressLine2 to be optional', () => {
		const params = {
			postcode: 'EF4 5GH',
			addressLine1: '42 The Avenue',
			townCity: 'A City'
		};

		const address = new Address(params);

		expect(address instanceof Address).toBeTruthy();
		expect(address.addressLine1).toBe(params.addressLine1);
		expect(address.addressLine2).toBe(undefined);
		expect(address.townCity).toBe(params.townCity);
		expect(address.postcode).toBe(params.postcode);
	});

	it('allows county to be optional', () => {
		const params = {
			postcode: 'EF4 5GH',
			addressLine1: '42 The Avenue',
			addressLine2: 'Somewhere',
			townCity: 'A City'
		};

		const address = new Address(params);

		expect(address instanceof Address).toBeTruthy();
		expect(address.addressLine1).toBe(params.addressLine1);
		expect(address.addressLine2).toBe(params.addressLine2);
		expect(address.townCity).toBe(params.townCity);
		expect(address.postcode).toBe(params.postcode);
		expect(address.county).toBe(undefined);
	});

	it('allows postcode to be optional', () => {
		const params = {
			addressLine1: '42 The Avenue',
			addressLine2: 'Some more text',
			townCity: 'A City'
		};

		const address = new Address(params);

		expect(address instanceof Address).toBeTruthy();
		expect(address.addressLine1).toBe(params.addressLine1);
		expect(address.addressLine2).toBe(params.addressLine2);
		expect(address.townCity).toBe(params.townCity);
		expect(address.postcode).toBe(undefined);
	});

	it('throws error if addressLine1 missing', () => {
		const params = {
			addressLine2: 'Somewhere',
			townCity: 'A Town',
			postcode: 'AB1 2CD'
		};

		expect(() => {
			new Address(params);
		}).toThrow('Address requires addressLine1');
	});

	it('throws error if townCity missing', () => {
		const params = {
			addressLine1: '1 The Street',
			addressLine2: 'Somewhere',
			postcode: 'AB1 2CD'
		};

		expect(() => {
			new Address(params);
		}).toThrow('Address requires townCity');
	});
});
