const mockDiscovery = jest.fn();
const mockGenericGrantRequest = jest.fn();
const mockClientCredentialsGrant = jest.fn();
const mockAllowInsecureRequests = Symbol('allowInsecureRequests');
const mockAUTH = {
	GRANT_TYPE: { OTP: 'otp', ROPC: 'ropc' },
	RESOURCE: 'test-resource'
};

jest.mock('../constants', () => ({
	AUTH: mockAUTH
}));
jest.unstable_mockModule('openid-client', () => {
	return {
		discovery: mockDiscovery,
		genericGrantRequest: mockGenericGrantRequest,
		clientCredentialsGrant: mockClientCredentialsGrant,
		allowInsecureRequests: mockAllowInsecureRequests
	};
});

const { URL } = require('url');

describe('Auth Client', () => {
	describe('getAuthClientConfig', () => {
		let originalEnv;
		let getAuthClientConfig;

		beforeEach(async () => {
			jest.resetAllMocks();
			jest.resetModules();

			originalEnv = { ...process.env };
			process.env = { ...originalEnv };
			mockDiscovery.mockResolvedValue({});
			({ getAuthClientConfig } = require('./auth-client'));
		});

		afterEach(() => {
			process.env = originalEnv;
		});

		it('throws if baseUrl is missing', async () => {
			await expect(getAuthClientConfig(undefined, 'id', 'secret')).rejects.toThrow(
				'Base URL, client ID, and client secret must be provided.'
			);
		});

		it('throws if client_id is missing', async () => {
			await expect(getAuthClientConfig('http://localhost', undefined, 'secret')).rejects.toThrow(
				'Base URL, client ID, and client secret must be provided.'
			);
		});

		it('throws if client_secret is missing', async () => {
			await expect(getAuthClientConfig('http://localhost', 'id', undefined)).rejects.toThrow(
				'Base URL, client ID, and client secret must be provided.'
			);
		});

		it('calls discovery with correct url and params', async () => {
			const baseUrl = 'https://example.com/';
			const client_id = 'cid';
			const client_secret = 'csecret';

			await getAuthClientConfig(baseUrl, client_id, client_secret);

			expect(mockDiscovery).toHaveBeenCalledTimes(1);
			const expectedUrl = new URL('https://example.com/oidc/.well-known/openid-configuration');
			expect(mockDiscovery).toHaveBeenCalledWith(expectedUrl, client_id, client_secret, undefined, {
				execute: []
			});
		});

		it('removes trailing slash from baseUrl', async () => {
			const baseUrl = 'https://example.com/';
			const client_id = 'cid';
			const client_secret = 'csecret';

			await getAuthClientConfig(baseUrl, client_id, client_secret);

			const expectedUrl = new URL('https://example.com/oidc/.well-known/openid-configuration');
			expect(mockDiscovery).toHaveBeenCalledWith(expectedUrl, client_id, client_secret, undefined, {
				execute: []
			});
		});

		it('adds allowInsecureRequests if http and IS_LOCALHOST is true', async () => {
			process.env.IS_LOCALHOST = 'true';
			const baseUrl = 'http://localhost:3000/';
			const client_id = 'cid';
			const client_secret = 'csecret';

			await getAuthClientConfig(baseUrl, client_id, client_secret);

			const expectedUrl = new URL('http://localhost:3000/oidc/.well-known/openid-configuration');
			expect(mockDiscovery).toHaveBeenCalledWith(expectedUrl, client_id, client_secret, undefined, {
				execute: [mockAllowInsecureRequests]
			});
		});

		it('returns cached config if already initialized', async () => {
			const baseUrl = 'https://example.com/';
			const client_id = 'cid';
			const client_secret = 'csecret';

			const config1 = await getAuthClientConfig(baseUrl, client_id, client_secret);
			const config2 = await getAuthClientConfig(baseUrl, client_id, client_secret);

			expect(config1).toBe(config2);
			expect(mockDiscovery).toHaveBeenCalledTimes(1);
		});
	});

	describe('createOTPGrant', () => {
		let createOTPGrant;
		let getAuthClientConfig;
		let authClientConfig = {};

		beforeEach(async () => {
			jest.resetAllMocks();
			jest.resetModules();

			({ createOTPGrant, getAuthClientConfig } = require('./auth-client'));
			mockDiscovery.mockResolvedValue(authClientConfig);
		});

		it('throws if auth client config is not initialized', async () => {
			await expect(createOTPGrant('test@example.com', 'test-action')).rejects.toThrow(
				'Auth client configuration is not initialized. Call getAuthClientConfig first.'
			);
		});

		it('calls genericGrantRequest with correct parameters', async () => {
			await getAuthClientConfig('https://example.com', 'test-client-id', 'test-client-secret');
			const email = 'test@example.com';
			const action = 'test-action';
			await createOTPGrant(email, action);
			expect(mockGenericGrantRequest).toHaveBeenCalledWith(authClientConfig, 'otp', {
				email,
				action,
				resource: mockAUTH.RESOURCE
			});
		});

		it('calls genericGrantRequest with resource', async () => {
			await getAuthClientConfig('https://example.com', 'test-client-id', 'test-client-secret');
			const email = 'test@example.com';
			const action = 'test-action';
			await createOTPGrant(email, action);
			expect(mockGenericGrantRequest).toHaveBeenCalledWith(authClientConfig, 'otp', {
				email,
				action,
				resource: mockAUTH.RESOURCE
			});
		});
	});

	describe('createROPCGrant', () => {
		let createROPCGrant;
		let getAuthClientConfig;
		let authClientConfig = {};

		beforeEach(async () => {
			jest.resetAllMocks();
			jest.resetModules();

			({ createROPCGrant, getAuthClientConfig } = require('./auth-client'));
			mockDiscovery.mockResolvedValue(authClientConfig);
		});

		it('throws if auth client config is not initialized', async () => {
			await expect(createROPCGrant('', '')).rejects.toThrow(
				'Auth client configuration is not initialized. Call getAuthClientConfig first.'
			);
		});

		it('calls genericGrantRequest with correct parameters', async () => {
			await getAuthClientConfig('https://example.com', 'test-client-id', 'test-client-secret');
			const email = 'test@example.com';
			const token = 'test-token';
			await createROPCGrant(email, token);
			expect(mockGenericGrantRequest).toHaveBeenCalledWith(authClientConfig, 'ropc', {
				email,
				otp: token,
				scope: 'openid email',
				resource: mockAUTH.RESOURCE
			});
		});

		it('returns the token from genericGrantRequest', async () => {
			const mockToken = { access_token: 'mock-access-token' };
			mockGenericGrantRequest.mockResolvedValue(mockToken);
			await getAuthClientConfig('https://example.com', 'test-client-id', 'test-client-secret');
			const email = 'test@example.com';
			const token = 'test-token';
			const result = await createROPCGrant(email, token);
			expect(result).toEqual(mockToken);
			expect(mockGenericGrantRequest).toHaveBeenCalledWith(authClientConfig, 'ropc', {
				email,
				otp: token,
				scope: 'openid email',
				resource: mockAUTH.RESOURCE
			});
		});
	});

	describe('createClientCredentialsGrant', () => {
		let createClientCredentialsGrant;
		let getAuthClientConfig;
		let authClientConfig = {};

		beforeEach(async () => {
			jest.resetAllMocks();
			jest.resetModules();

			({ createClientCredentialsGrant, getAuthClientConfig } = require('./auth-client'));
			mockDiscovery.mockResolvedValue(authClientConfig);
		});

		it('throws if auth client config is not initialized', async () => {
			await expect(createClientCredentialsGrant()).rejects.toThrow(
				'Auth client configuration is not initialized. Call getAuthClientConfig first.'
			);
		});

		it('calls createClientCredentialsGrant with correct parameters', async () => {
			await getAuthClientConfig('https://example.com', 'test-client-id', 'test-client-secret');
			await createClientCredentialsGrant();
			expect(mockClientCredentialsGrant).toHaveBeenCalledWith(authClientConfig, {
				resource: mockAUTH.RESOURCE
			});
		});
	});
});
