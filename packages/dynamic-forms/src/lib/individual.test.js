const Individual = require('./individual');

describe('Individual', () => {
	it('creates an instance of an Individual', () => {
		const params = {
			firstName: 'testFirstName',
			lastName: 'testLastName'
		};

		const address = new Individual(params);

		expect(address instanceof Individual).toBeTruthy();
		expect(address.firstName).toBe(params.firstName);
		expect(address.lastName).toBe(params.lastName);
	});

	it('throws error if firstName missing', () => {
		const params = {
			lastName: 'testLastName'
		};

		expect(() => {
			new Individual(params);
		}).toThrow('Individual requires firstName');
	});

	it('throws error if lastName missing', () => {
		const params = {
			firstName: 'testFirstName'
		};

		expect(() => {
			new Individual(params);
		}).toThrow('Individual requires lastName');
	});
});
