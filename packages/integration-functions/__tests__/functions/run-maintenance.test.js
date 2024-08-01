const handler = require('../../src/functions/run-maintenance');
const {
	deleteOldSubmissions
} = require('../../../appeals-service-api/src/routes/v2/appellant-submissions/service');
const { InvocationContext } = require('@azure/functions');

jest.mock('../../../appeals-service-api/src/routes/v2/appellant-submissions/service', () => ({
	deleteOldSubmissions: jest.fn()
}));

describe('run-maintenance', () => {
	const ctx = new InvocationContext({ functionName: 'appeal-event' });
	ctx.log = jest.fn();

	beforeEach(async () => {
		jest.clearAllMocks();
	});

	it('should call deleteOldSubmissions and log success', async () => {
		deleteOldSubmissions.mockResolvedValue('Cleanup successful');

		await handler({}, ctx);

		expect(deleteOldSubmissions).toHaveBeenCalled();
		expect(ctx.log).toHaveBeenCalledWith('Starting data cleanup process');
		expect(ctx.log).toHaveBeenCalledWith(
			'Data cleanup completed successfully:',
			'Cleanup successful'
		);
	});
	it('should log an error if deleteOldSubmissions fails', async () => {
		deleteOldSubmissions.mockRejectedValue(new Error('Failed to delete'));

		await expect(handler({}, ctx)).rejects.toThrow('Error deleting old submissions');

		expect(ctx.log).toHaveBeenCalledWith('Error during data cleanup:', 'Failed to delete');
	});
});
