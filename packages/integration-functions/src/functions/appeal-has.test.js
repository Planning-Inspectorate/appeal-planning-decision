const { InvocationContext } = require('@azure/functions');
const handler = require('./appeal-has');
const { AppealsApiClient } = require('@pins/common/src/client/appeals-api-client');
const config = require('../common/config');

const mockPutAppealCase = jest.fn();

describe('appeal-has', () => {
	const ctx = new InvocationContext({ functionName: 'appeal-has' });
	ctx.log = jest.fn();

	beforeEach(async () => {
		jest.clearAllMocks();
		jest.spyOn(AppealsApiClient.prototype, 'putAppealCase').mockImplementation(mockPutAppealCase);
		config.API = {
			HOSTNAME: 'test'
		};
	});

	it('should send valid message to api', async () => {
		const testData = {
			caseReference: 'abc'
		};

		const result = await handler(testData, ctx);

		expect(AppealsApiClient.prototype.putAppealCase).toHaveBeenCalledWith(testData);
		expect(result).toEqual({});
	});

	it('should error if message schema is invalid', async () => {
		await expect(async () => handler({ body: {} }, ctx)).rejects.toThrowError(
			'invalid message, caseReference is required'
		);
		expect(AppealsApiClient.prototype.putAppealCase).not.toHaveBeenCalled();
	});
});
