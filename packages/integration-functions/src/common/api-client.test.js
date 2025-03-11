const { AppealsApiClient } = require('@pins/common/src/client/appeals-api-client');
const { getAuthClient } = require('@pins/common/src/client/auth-client');
const { AUTH } = require('@pins/common/src/constants');
const config = require('./config');
const createApiClient = require('./api-client');

jest.mock('@pins/common/src/client/appeals-api-client');
jest.mock('@pins/common/src/client/auth-client');
jest.mock('../../src/common/config');

describe('createApiClient', () => {
	let mockClient;

	beforeEach(() => {
		mockClient = {
			grant: jest.fn()
		};

		getAuthClient.mockResolvedValue(mockClient);
		config.oauth = {
			baseUrl: 'mockBaseUrl',
			clientID: 'mockClientID',
			clientSecret: 'mockClientSecret'
		};
		config.API = {
			HOSTNAME: 'mockHostname',
			TIMEOUT: 1000
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should create an AppealsApiClient instance and handle caching', async () => {
		// next instance is not cached
		mockClient.grant.mockResolvedValue({
			access_token: 'mockAccessToken',
			expires_in: 599
		});

		const apiClient = await createApiClient();

		expect(getAuthClient).toHaveBeenCalledWith(
			config.oauth.baseUrl,
			config.oauth.clientID,
			config.oauth.clientSecret
		);
		expect(mockClient.grant).toHaveBeenCalledWith({
			resource: AUTH.RESOURCE,
			grant_type: AUTH.GRANT_TYPE.CLIENT_CREDENTIALS
		});
		expect(apiClient).toBeInstanceOf(AppealsApiClient);
		expect(AppealsApiClient).toHaveBeenCalledWith(
			config.API.HOSTNAME,
			{
				access_token: null,
				id_token: null,
				client_creds: 'mockAccessToken'
			},
			config.API.TIMEOUT
		);

		// next instance is cached
		mockClient.grant.mockResolvedValue({
			access_token: 'mockAccessToken',
			expires_in: 601
		});
		const apiClient2 = await createApiClient();
		expect(getAuthClient).toHaveBeenCalledTimes(2);
		expect(mockClient.grant).toHaveBeenCalledTimes(2);
		expect(apiClient2).toBeInstanceOf(AppealsApiClient);

		// gets cached instance so no more calls to auth
		const apiClient3 = await createApiClient();
		expect(getAuthClient).toHaveBeenCalledTimes(2);
		expect(mockClient.grant).toHaveBeenCalledTimes(2);
		expect(apiClient3).toBeInstanceOf(AppealsApiClient);
	});
});
