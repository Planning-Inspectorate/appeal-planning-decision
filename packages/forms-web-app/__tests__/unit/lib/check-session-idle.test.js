const checkSessionIdle = require('../../../src/lib/check-session-idle');

describe('checkSessionIdle', () => {
	let req;

	beforeEach(() => {
		req = { session: {} };
	});

	it('should return false if session is not idle', () => {
		req.session.lastAccessedTime = Date.now() - 1000; // Last accessed 1 second ago
		expect(checkSessionIdle(req, 5000)).toBe(false);
	});

	it('should update lastAccessedTime if not idle and more than delay', () => {
		const lastAccessedTime = Date.now() - 1000; // Last accessed 1 second ago
		req.session.lastAccessedTime = lastAccessedTime;
		const result = checkSessionIdle(req, 5000, 1);
		expect(req.session.lastAccessedTime).toBeGreaterThan(lastAccessedTime);
		expect(result).toBe(false);
	});

	it('should not update lastAccessedTime if not idle and less than delay', () => {
		const lastAccessedTime = Date.now() - 1000; // Last accessed 1 second ago
		req.session.lastAccessedTime = lastAccessedTime;
		const result = checkSessionIdle(req, 5000, 2000);
		expect(req.session.lastAccessedTime).toBe(lastAccessedTime);
		expect(result).toBe(false);
	});

	it('should return true if session is idle', () => {
		const lastAccessedTime = Date.now() - 6000; // Last accessed 6 seconds ago
		req.session.lastAccessedTime = lastAccessedTime;
		expect(checkSessionIdle(req, 5000)).toBe(true);
	});
});
