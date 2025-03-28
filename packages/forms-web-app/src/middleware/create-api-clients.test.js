const { createApiClients } = require('#middleware/create-api-clients');
const { getAuthClient } = require('@pins/common/src/client/auth-client');

// Mocking dependencies
jest.mock('@pins/common/src/client/appeals-api-client', () => ({
	AppealsApiClient: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('@pins/common/src/client/documents-api-client', () => ({
	DocumentsApiClient: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('@pins/common/src/client/auth-client', () => ({
	getAuthClient: jest.fn()
}));

const { TokenSet } = require('openid-client');
const mockedGrant = jest.fn().mockImplementation(async () => {
	return new TokenSet({ access_token: 'clientCredentialsToken', expires_in: 3600 });
});

getAuthClient.mockResolvedValue({
	grant: mockedGrant
});

jest.mock('../services/user.service', () => ({
	getUserFromSession: jest.fn()
}));

const config = require('../config');

describe('createApiClients middleware', () => {
	let req, res, next;

	beforeEach(() => {
		req = {};
		res = {};
		next = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should create API clients with access tokens from request session', async () => {
		require('../services/user.service').getUserFromSession.mockReturnValueOnce({
			access_token: 'appellantAccessToken'
		});

		await createApiClients(req, res, next);

		expect(req.appealsApiClient).toBeDefined();
		expect(req.docsApiClient).toBeDefined();

		expect(
			require('@pins/common/src/client/appeals-api-client').AppealsApiClient
		).toHaveBeenCalledWith(
			config.appeals.url,
			{
				access_token: 'appellantAccessToken',
				id_token: undefined,
				client_creds: undefined
			},
			config.appeals.timeout
		);

		expect(
			require('@pins/common/src/client/documents-api-client').DocumentsApiClient
		).toHaveBeenCalledWith(
			config.documents.url,
			{
				access_token: 'appellantAccessToken',
				id_token: undefined,
				client_creds: undefined
			},
			config.documents.timeout
		);

		// Ensure next() is called
		expect(next).toHaveBeenCalled();
	});

	it('should create API clients with client credentials if no access token in request session', async () => {
		require('../services/user.service').getUserFromSession.mockReturnValueOnce(null);

		await createApiClients(req, res, next);

		expect(req.appealsApiClient).toBeDefined();
		expect(req.docsApiClient).toBeDefined();

		expect(
			require('@pins/common/src/client/appeals-api-client').AppealsApiClient
		).toHaveBeenCalledWith(
			config.appeals.url,
			{
				access_token: undefined,
				id_token: undefined,
				client_creds: 'clientCredentialsToken'
			},
			config.appeals.timeout
		);

		expect(
			require('@pins/common/src/client/documents-api-client').DocumentsApiClient
		).toHaveBeenCalledWith(
			config.documents.url,
			{
				access_token: undefined,
				id_token: undefined,
				client_creds: 'clientCredentialsToken'
			},
			config.documents.timeout
		);

		expect(next).toHaveBeenCalled();
	});
});
