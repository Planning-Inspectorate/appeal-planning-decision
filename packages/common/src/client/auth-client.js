const oidcClient = require('openid-client');
const { AUTH } = require('../constants');

const trailingSlashRegex = /\/$/;

/** @type {import('openid-client').Client} */
let authClient;

/**
 * @param {string} baseUrl
 * @param {string} client_id
 * @param {string} client_secret
 * @returns {Promise<import('openid-client').Client>}
 */
const getAuthClient = async (baseUrl, client_id, client_secret) => {
	if (!authClient) {
		baseUrl = baseUrl.replace(trailingSlashRegex, '');

		const issuer = await oidcClient.Issuer.discover(
			`${baseUrl}/oidc/.well-known/openid-configuration`
		);

		authClient = new issuer.Client({
			client_id: client_id,
			client_secret: client_secret,
			token_endpoint_auth_method: AUTH.CLIENT_AUTH_METHOD
		});
	}

	return authClient;
};

/**
 * @param {import('openid-client').Client} authClient
 * @param {string} email
 * @param {string} action
 * @returns {Promise<void>}
 */

const createOTPGrant = async (authClient, email, action) => {
	await authClient.grant({
		grant_type: AUTH.GRANT_TYPE.OTP,
		email: email,
		action: action,
		resource: AUTH.RESOURCE
	});
};

module.exports = { getAuthClient, createOTPGrant };
