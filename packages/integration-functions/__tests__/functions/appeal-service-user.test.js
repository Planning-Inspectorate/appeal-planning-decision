const handler = require('../../src/functions/appeal-service-user');
const config = require('../../src/common/config');
const createApiClient = require('../../src/common/api-client');
const { InvocationContext } = require('@azure/functions');

jest.mock('../../src/common/api-client');

describe('appeal-service-user', () => {
	const ctx = new InvocationContext({ functionName: 'service-user' });
	ctx.log = jest.fn();
	ctx.debug = jest.fn();
	const mockClient = {
		putServiceUser: jest.fn(),
		deleteR6UserAppealLink: jest.fn()
	};

	beforeEach(async () => {
		jest.clearAllMocks();

		createApiClient.mockResolvedValue(mockClient);
		config.API = {
			...config.API,
			HOSTNAME: 'test'
		};
	});

	it('forwards a put message to the appeals api', async () => {
		const testServiceUser = {
			service: 'user'
		};

		await handler(testServiceUser, ctx);
		expect(ctx.debug).toHaveBeenCalledWith('Handle service user message', testServiceUser);
		expect(ctx.log).toHaveBeenCalledWith('Sending service user request to API');
		expect(mockClient.putServiceUser).toHaveBeenCalledWith(testServiceUser);
	});

	it('handles a delete message for an r6 user', async () => {
		const testR6ServiceUser = {
			serviceUserType: 'Rule6Party'
		};

		await handler(testR6ServiceUser, {
			...ctx,
			triggerMetadata: { applicationProperties: { type: 'Delete' } }
		});
		expect(ctx.debug).toHaveBeenCalledWith('Handle service user message', testR6ServiceUser);
		expect(ctx.log).toHaveBeenCalledWith('Sending unlink rule 6 party request to API');
		expect(mockClient.deleteR6UserAppealLink).toHaveBeenCalledWith(testR6ServiceUser);
	});
});
