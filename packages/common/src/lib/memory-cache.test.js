const { getOrSetCache, removeFromCache } = require('./memory-cache');

describe('memory-cache', () => {
	it('returns value from fetchFn and caches it', async () => {
		let callCount = 0;
		const fetchFn = async () => {
			callCount++;
			return 'foo';
		};
		const result1 = await getOrSetCache('key1', fetchFn, 1000);
		const result2 = await getOrSetCache('key1', fetchFn, 1000);
		expect(result1).toBe('foo');
		expect(result2).toBe('foo');
		expect(callCount).toBe(1); // Only called once due to cache
	});

	it('calls fetchFn again after TTL expires', async () => {
		let callCount = 0;
		const fetchFn = async () => {
			callCount++;
			return 'bar';
		};
		const result1 = await getOrSetCache('key2', fetchFn, 10);
		expect(result1).toBe('bar');
		// Wait for TTL to expire
		await new Promise((r) => setTimeout(r, 15));
		const result2 = await getOrSetCache('key2', fetchFn, 10);
		expect(result2).toBe('bar');
		expect(callCount).toBe(2);
	});

	it('removes a key from cache', async () => {
		const fetchFn = async () => 'baz';
		await getOrSetCache('key3', fetchFn, 1000);
		removeFromCache('key3');
		// Should call fetchFn again after removal
		let called = false;
		const fetchFn2 = async () => {
			called = true;
			return 'baz2';
		};
		const result = await getOrSetCache('key3', fetchFn2, 1000);
		expect(result).toBe('baz2');
		expect(called).toBe(true);
	});
});
