const { InvocationContext } = require('@azure/functions');
const handler = require('../../src/functions/appeal-s78');
const createApiClient = require('../../src/common/api-client');
const config = require('../../src/common/config');

jest.mock('../../src/common/api-client');
jest.mock('../../src/common/config');

describe('appeal-s78', () => {
	const ctx = new InvocationContext({ functionName: 'appeal-s78' });
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
		await expect(async () => handler({ body: {} }, ctx)).rejects.toThrow(
			'invalid message, caseReference is required'
		);
		expect(mockClient.putAppealCase).not.toHaveBeenCalled();
	});

	it('should error if API.HOSTNAME undefined', async () => {
		config.API.HOSTNAME = undefined;
		const testData = {
			caseReference: 'abc'
		};
		await expect(async () => handler(testData, ctx)).rejects.toThrow(
			'process.env.FO_APPEALS_API_HOSTNAME not set'
		);
		expect(mockClient.putAppealCase).not.toHaveBeenCalled();
	});
});
