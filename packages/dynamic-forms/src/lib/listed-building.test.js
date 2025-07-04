const ListedBuilding = require('./listed-building');

describe('Listed Building', () => {
	it('creates an instance of a Listed Building', () => {
		const reference = '1010101';
		const grade = 'II';
		const name = 'An Old House';

		const listedBuilding = new ListedBuilding(reference, name, grade);

		expect(listedBuilding instanceof ListedBuilding).toBeTruthy();
		expect(listedBuilding.reference).toBe(reference);
		expect(listedBuilding.listedBuildingGrade).toBe(grade);
		expect(listedBuilding.name).toBe(name);
	});

	it('throws error if reference missing', () => {
		expect(() => {
			new ListedBuilding('');
		}).toThrow('Listed Building requires reference');
	});

	it('throws error if name missing', () => {
		expect(() => {
			new ListedBuilding('reference');
		}).toThrow('Listed Building requires name');
	});

	it('throws error if grade missing', () => {
		expect(() => {
			new ListedBuilding('reference', 'name');
		}).toThrow('Listed Building requires grade');
	});
});
