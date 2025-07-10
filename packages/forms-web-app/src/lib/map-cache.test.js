const MapCache = require('./map-cache.js');

const now = new Date('2025-01-30T00:00:00.000Z');

describe('MapCache', () => {
	beforeEach(() => {
		jest.useFakeTimers().setSystemTime(now);
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should add entries with the current date', () => {
		const cache = new MapCache(5);

		cache.set('id-1', true);

		expect(cache.cache.get('id-1').updated).toEqual(now);
	});

	it(`should return values that aren't expired`, () => {
		const cache = new MapCache(5);
		cache.set('id-1', true);
		cache.set('id-2', 'value 2');

		expect(cache.get('id-1')).toBe(true);
		expect(cache.get('id-2')).toBe('value 2');
	});

	it(`should return undefined if no entry`, () => {
		const cache = new MapCache(5);

		expect(cache.get('id-1')).toBe(undefined);
	});

	it(`should not return expired values`, () => {
		const cache = new MapCache(5);
		cache.set('id-1', true);
		cache.set('id-2', 'value 2');

		expect(cache.get('id-1')).toBe(true);
		expect(cache.get('id-2')).toBe('value 2');

		// 5 minutes later, still not expired
		jest.setSystemTime(new Date('2025-01-30T00:05:00.000Z'));
		expect(cache.get('id-1')).toBe(true);
		expect(cache.get('id-2')).toBe('value 2');

		// 10 minutes later, now expired
		jest.setSystemTime(new Date('2025-01-30T00:10:00.000Z'));
		expect(cache.get('id-1')).toBe(undefined);
		expect(cache.get('id-2')).toBe(undefined);
	});
});
