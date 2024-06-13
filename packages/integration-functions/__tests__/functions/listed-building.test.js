const handler = require('../../src/functions/listed-building');
const { InvocationContext } = require('@azure/functions');
const got = require('got');

jest.mock('got');

describe('listed-building', () => {
	const context = new InvocationContext({ functionName: 'appeal-service-user' });
	context.log = jest.fn();

	beforeEach(async () => {
		jest.clearAllMocks();
		got.put.mockImplementation(() => {
			return {
				json: jest.fn()
			};
		});
	});

	it('should send array to api', async () => {
		const msg = [1, 2];
		await handler(msg, context);

		expect(context.log).toHaveBeenCalledWith('Handle listed building message', msg);
		expect(got.put).toHaveBeenCalledWith(`https://undefined/listed-buildings`, { json: msg });
	});

	it('should send single message to api as an array', async () => {
		const msg = { test: 1 };
		await handler(msg, context);

		expect(context.log).toHaveBeenCalledWith('Handle listed building message', msg);
		expect(got.put).toHaveBeenCalledWith(`https://undefined/listed-buildings`, { json: [msg] });
	});
});

describe('', () => {});
