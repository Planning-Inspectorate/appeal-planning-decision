const { AUTH } = require('../constants');
const { URL } = require('url');
const trailingSlashRegex = /\/$/;

/**
 * @typedef {import('openid-client').Configuration} OpenIdClientConfig
 * @typedef {import('openid-client').TokenEndpointResponse} TokenEndpointResponse
 * @typedef {import('openid-client').TokenEndpointResponseHelpers} TokenEndpointResponseHelpers
 * @typedef {TokenEndpointResponse & TokenEndpointResponseHelpers} Token
 */

/** @type {import('openid-client').Configuration} */
let authClientConfig;
/** @type {import('openid-client')} */
let authClient;

/**
 * @param {string|undefined} baseUrl
 * @param {string|undefined} client_id
 * @param {string|undefined} client_secret
 * @returns {Promise<import('openid-client').Configuration>}
 */
exports.getAuthClientConfig = async (baseUrl, client_id, client_secret) => {
	if (!baseUrl || !client_id || !client_secret) {
		throw new Error('Base URL, client ID, and client secret must be provided.');
	}

	if (!authClientConfig || !authClient) {
		baseUrl = baseUrl.replace(trailingSlashRegex, '');
		const discoveryUrl = new URL(`${baseUrl}/oidc/.well-known/openid-configuration`);
		authClient = await import('openid-client');

		const executeOptions = [];

		if (baseUrl.startsWith('http:') && process.env.IS_LOCALHOST === 'true') {
			executeOptions.push(authClient.allowInsecureRequests);
		}

		authClientConfig = await authClient.discovery(
			discoveryUrl,
			client_id,
			client_secret,
			undefined,
			{
				execute: executeOptions
			}
		);
	}

	return authClientConfig;
};

/**
 * @param {string} email
 * @param {string} action
 * @returns {Promise<void>}
 */
exports.createOTPGrant = async (email, action) => {
	if (!authClientConfig || !authClient) {
		throw new Error(
			'Auth client configuration is not initialized. Call getAuthClientConfig first.'
		);
	}

	await authClient.genericGrantRequest(authClientConfig, AUTH.GRANT_TYPE.OTP, {
		email: email,
		action: action,
		resource: AUTH.RESOURCE
	});
};

/**
 * @param {string} email
 * @param {string} token
 * @param {string[]} [additionalScopes]
 * @returns {Promise<Token>}
 */
exports.createROPCGrant = async (email, token, additionalScopes) => {
	if (!authClientConfig || !authClient) {
		throw new Error(
			'Auth client configuration is not initialized. Call getAuthClientConfig first.'
		);
	}

	const scopes = [AUTH.SCOPES.USER_DETAILS.OPENID, AUTH.SCOPES.USER_DETAILS.EMAIL];
	if (additionalScopes && additionalScopes.length > 0) {
		scopes.push(...additionalScopes);
	}

	return authClient.genericGrantRequest(authClientConfig, AUTH.GRANT_TYPE.ROPC, {
		email: email,
		otp: token,
		scope: scopes.join(' '),
		resource: AUTH.RESOURCE
	});
};

/**
 * @returns {Promise<Token>}
 */
exports.createClientCredentialsGrant = async () => {
	if (!authClientConfig || !authClient) {
		throw new Error(
			'Auth client configuration is not initialized. Call getAuthClientConfig first.'
		);
	}

	return authClient.clientCredentialsGrant(authClientConfig, {
		resource: AUTH.RESOURCE
	});
};
