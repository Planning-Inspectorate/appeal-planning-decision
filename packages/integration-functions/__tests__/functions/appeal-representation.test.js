const handler = require('../../src/functions/appeal-representation');
const config = require('../../src/common/config');
const createApiClient = require('../../src/common/api-client');
const { InvocationContext } = require('@azure/functions');

jest.mock('../../src/common/api-client');

describe('appeal-representation', () => {
	const ctx = new InvocationContext({ functionName: 'appeal-representation' });
	ctx.log = jest.fn();
	const mockClient = {
		putAppealRepresentation: jest.fn()
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
		const testData = {
			caseReference: 'abc',
			representationId: 'def'
		};

		await handler(testData, ctx);
		expect(mockClient.putAppealRepresentation).toHaveBeenCalledWith(testData);
	});
});
