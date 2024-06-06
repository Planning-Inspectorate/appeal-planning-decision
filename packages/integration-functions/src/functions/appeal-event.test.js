const { InvocationContext } = require('@azure/functions');
const handler = require('./appeal-event');

describe('appeal-event', () => {
	it('logs the message', async () => {
		const context = new InvocationContext({ functionName: 'appeal-event' });
		context.log = jest.fn();

		try {
			await handler('hello', context);
		} catch (err) {
			expect(err.message).toEqual('not implemented');
		}
		expect(context.log).toHaveBeenCalledWith('Handle event message', 'hello');
	});
});
