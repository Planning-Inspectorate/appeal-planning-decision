const handler = require('../../src/functions/listed-building');
const config = require('../../src/common/config');
const createApiClient = require('../../src/common/api-client');
const { InvocationContext } = require('@azure/functions');

jest.mock('../../src/common/api-client');

describe('listed-building', () => {
	const ctx = new InvocationContext({ functionName: 'listed-building' });
	ctx.log = jest.fn();
	const mockClient = {
		putListedBuildings: jest.fn()
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
		const testData = [{ reference: '123', name: 'test building' }];
		await handler(testData, ctx);
		expect(mockClient.putListedBuildings).toHaveBeenCalledWith(testData);
	});
});
