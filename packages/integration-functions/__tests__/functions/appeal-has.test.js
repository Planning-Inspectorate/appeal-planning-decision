const { InvocationContext } = require('@azure/functions');
const handler = require('../../src/functions/appeal-has');
const createApiClient = require('../../src/common/api-client');
const config = require('../../src/common/config');

jest.mock('../../src/common/api-client');

describe('appeal-has', () => {
	const ctx = new InvocationContext({ functionName: 'appeal-has' });
	ctx.log = jest.fn();
	const mockClient = {
		putAppealCase: jest.fn()
	};

	beforeEach(async () => {
		jest.clearAllMocks();

		createApiClient.mockResolvedValue(mockClient);
		config.API = {
			HOSTNAME: 'test'
		};
	});

	it('should send valid message to api', async () => {
		const testData = {
			caseReference: 'abc'
		};

		const result = await handler(testData, ctx);

		expect(mockClient.putAppealCase).toHaveBeenCalledWith(testData);
		expect(result).toEqual({});
	});

	it('should error if message schema is invalid', async () => {
		await expect(async () => handler({ body: {} }, ctx)).rejects.toThrowError(
			'invalid message, caseReference is required'
		);
		expect(mockClient.putAppealCase).not.toHaveBeenCalled();
	});
});
