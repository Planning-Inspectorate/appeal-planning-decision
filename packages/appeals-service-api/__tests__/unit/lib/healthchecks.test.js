const common = require('../../../src/common');
const healthcheck = require('../../../src/lib/healthchecks');
const mongodb = require('../../../src/db/db');

jest.mock('../../../src/common');

mongodb.get = jest.fn(() => ({
	admin: jest.fn(() => ({
		ping: jest.fn()
	}))
}));
mongodb.close = jest.fn();

describe('lib/healthchecks', () => {
	it('should configure the healthcheck correctly', () => {
		const server = jest.fn();

		expect(healthcheck(server)).toBe(undefined);

		expect(common.healthcheck).toBeCalledTimes(1);
	});
});
