const { AppealsApiClient } = require('@pins/common/src/client/appeals-api-client');
const {
	getAuthClientConfig,
	createClientCredentialsGrant
} = require('@pins/common/src/client/auth-client');
const config = require('./config');
const createApiClient = require('./api-client');

jest.mock('@pins/common/src/client/appeals-api-client');
jest.mock('@pins/common/src/client/auth-client');
jest.mock('../../src/common/config');

describe('createApiClient', () => {
	beforeEach(() => {
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
		createClientCredentialsGrant.mockResolvedValue({
			access_token: 'mockAccessToken',
			expires_in: 599
		});

		const apiClient = await createApiClient();

		expect(getAuthClientConfig).toHaveBeenCalledWith(
			config.oauth.baseUrl,
			config.oauth.clientID,
			config.oauth.clientSecret
		);
		expect(createClientCredentialsGrant).toHaveBeenCalledWith();
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
		createClientCredentialsGrant.mockResolvedValue({
			access_token: 'mockAccessToken',
			expires_in: 601
		});
		const apiClient2 = await createApiClient();
		expect(getAuthClientConfig).toHaveBeenCalledTimes(2);
		expect(createClientCredentialsGrant).toHaveBeenCalledTimes(2);
		expect(apiClient2).toBeInstanceOf(AppealsApiClient);

		// gets cached instance so no more calls to auth
		const apiClient3 = await createApiClient();
		expect(getAuthClientConfig).toHaveBeenCalledTimes(2);
		expect(createClientCredentialsGrant).toHaveBeenCalledTimes(2);
		expect(apiClient3).toBeInstanceOf(AppealsApiClient);
	});
});
