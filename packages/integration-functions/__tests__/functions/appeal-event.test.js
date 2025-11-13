const handler = require('../../src/functions/appeal-event');
const config = require('../../src/common/config');
const createApiClient = require('../../src/common/api-client');
const { InvocationContext } = require('@azure/functions');

jest.mock('../../src/common/api-client');

describe('appeal-event', () => {
	const ctx = new InvocationContext({ functionName: 'appeal-event' });
	ctx.log = jest.fn();
	const mockClient = {
		putAppealEvent: jest.fn(),
		deleteAppealEvent: jest.fn()
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
		expect(mockClient.putAppealEvent).toHaveBeenCalledWith({ appeal: 'event' });
	});

	it('Should delete event if meta data is delete type', async () => {
		const testData = { eventId: 123 };
		const result = await handler(testData, {
			...ctx,
			triggerMetadata: { applicationProperties: { type: 'Delete' } }
		});

		expect(mockClient.deleteAppealEvent).toHaveBeenCalledWith(testData.eventId);
		expect(result).toEqual({});
	});
});
