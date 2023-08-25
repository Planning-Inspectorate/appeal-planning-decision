const flattenObjectToDotNotation = require('../../../src/lib/flattenObjectToDotNotation');

describe('flattenObjectToDotNotation', () => {
	it('flattens an object to dot notation', () => {
		const testObject = {
			someKey: { someNestedKey: { a: 1, b: '2', c: true } },
			someOtherKey: 'someValue'
		};

		const flattenedTestObject = {
			'someKey.someNestedKey.a': 1,
			'someKey.someNestedKey.b': '2',
			'someKey.someNestedKey.c': true,
			someOtherKey: 'someValue'
		};

		expect(flattenObjectToDotNotation(testObject)).toEqual(flattenedTestObject);
	});

	it('flattens an object that includes date objects', () => {
		const testDate = new Date('2023-08-17T03:24:00');

		const testObject = {
			someDate: testDate,
			someOtherKey: { someNestedDate: testDate }
		};

		const flattenedTestObject = {
			someDate: testDate,
			'someOtherKey.someNestedDate': testDate
		};

		expect(flattenObjectToDotNotation(testObject)).toEqual(flattenedTestObject);
	});
});
