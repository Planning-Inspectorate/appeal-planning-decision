const got = require('got');
const run = require('./index.js');
jest.mock('got');

describe('listed-building-fo-integration', () => {
	function getTestContext() {
		const ctx = {};
		ctx.log = jest.fn();
		ctx.log.info = jest.fn();
		ctx.log.warn = jest.fn();
		ctx.log.error = jest.fn();
		return ctx;
	}

	beforeEach(async () => {
		jest.clearAllMocks();
		got.post.mockImplementation(() => {
			return {
				json: jest.fn()
			};
		});
	});

	it('should send array to api', async () => {
		const ctx = getTestContext();
		const msg = [1, 2];
		await run(ctx, msg);

		expect(ctx.log).toHaveBeenCalledWith('Handle listed building message', msg);
		expect(got.post).toHaveBeenCalledWith(`https://undefined/listed-building`, { json: msg });
	});

	it('should send single message to api as an array', async () => {
		const ctx = getTestContext();
		const msg = { test: 1 };
		await run(ctx, msg);

		expect(ctx.log).toHaveBeenCalledWith('Handle listed building message', msg);
		expect(got.post).toHaveBeenCalledWith(`https://undefined/listed-building`, { json: [msg] });
	});
});
