const { caseTypeLookup, CASE_TYPES } = require('./data-static');

describe('caseTypeLookup', () => {
	it('should return the correct case type for a given process code', () => {
		const processCode = 'processCode';
		for (const caseType of Object.values(CASE_TYPES)) {
			expect(caseTypeLookup(caseType.processCode, processCode)).toEqual(caseType);
		}
		expect(caseTypeLookup('UNKNOWN_PROCESS_CODE', processCode)).toBeUndefined();
	});

	it('should return the correct case type for a given id', () => {
		const id = 'id';
		for (const caseType of Object.values(CASE_TYPES)) {
			expect(caseTypeLookup(caseType.id, id)).toEqual(caseType);
		}
		expect(caseTypeLookup('UNKNOWN_ID', id)).toBeUndefined();
	});

	it('should return the correct case type for a given type name', () => {
		const type = 'type';
		for (const caseType of Object.values(CASE_TYPES)) {
			expect(caseTypeLookup(caseType.type, type)).toEqual(caseType);
		}
		expect(caseTypeLookup('UNKNOWN_TYPE', type)).toBeUndefined();
	});

	it('will throw if result is non unique value', () => {
		expect(() => {
			caseTypeLookup('any', 'friendlyUrl');
		}).toThrow();
		expect(() => {
			caseTypeLookup('any', 'caption');
		}).toThrow();
		expect(() => {
			caseTypeLookup('any', 'unknownKey');
		}).toThrow();
	});
});
