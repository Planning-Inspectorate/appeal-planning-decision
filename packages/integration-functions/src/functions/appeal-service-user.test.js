const { InvocationContext } = require('@azure/functions');
const handler = require('./appeal-service-user');

describe('appeal-service-user', () => {
	it('logs the message', async () => {
		const context = new InvocationContext({ functionName: 'appeal-service-user' });
		context.log = jest.fn();

		try {
			await handler('hello', context);
		} catch (err) {
			expect(err.message).toEqual('not implemented');
		}
		expect(context.log).toHaveBeenCalledWith('Handle service user message', 'hello');
	});
});
