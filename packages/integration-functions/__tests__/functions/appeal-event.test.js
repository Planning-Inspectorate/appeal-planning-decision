const handler = require('../../src/functions/appeal-service-user');
const config = require('../../src/common/config');
const createApiClient = require('../../src/common/api-client');
const { InvocationContext } = require('@azure/functions');

jest.mock('../../src/common/api-client');

describe('appeal-event', () => {
	const ctx = new InvocationContext({ functionName: 'appeal-event' });
	ctx.log = jest.fn();
	const mockClient = {
		putServiceUser: jest.fn()
	};

	beforeEach(async () => {
		jest.clearAllMocks();

		createApiClient.mockResolvedValue(mockClient);
		config.API = {
			...config.API,
			HOSTNAME: 'test'
		};
	});

	it('forwards the message to the appeals api', async () => {
		await handler({ appeal: 'event' }, ctx);
		expect(mockClient.putServiceUser).toHaveBeenCalledWith({ appeal: 'event' });
	});
});
