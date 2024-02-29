const oidcClient = require('openid-client');
const { AUTH } = require('@pins/common/src/constants');

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

module.exports = getAuthClient;
