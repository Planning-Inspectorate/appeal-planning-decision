const handler = require('../../src/functions/run-maintenance');
const config = require('../../src/common/config');
const createApiClient = require('../../src/common/api-client');
const { InvocationContext } = require('@azure/functions');

jest.mock('../../src/common/api-client');

describe('run-maintenance', () => {
	const ctx = new InvocationContext({ functionName: 'run-maintenance' });
	ctx.log = jest.fn();
	const mockClient = {
		cleanupOldSubmissions: jest.fn()
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		mockClient.cleanupOldSubmissions = jest.fn();
		createApiClient.mockResolvedValue(mockClient);
		config.API = {
			...config.API,
			HOSTNAME: 'test'
		};
	});

	it('should call deleteOldSubmissions and log success', async () => {
		await handler({}, ctx);
		expect(mockClient.cleanupOldSubmissions).toHaveBeenCalled();
	});

	it('should log an error if deleteOldSubmissions fails', async () => {
		mockClient.cleanupOldSubmissions.mockRejectedValue(new Error('Failed to delete'));
		await expect(handler({}, ctx)).rejects.toThrow('Error deleting old submissions');
		expect(ctx.log).toHaveBeenCalledWith('Error during data cleanup:', 'Failed to delete');
	});
});
