const { AppealsApiClient } = require('@pins/common/src/client/appeals-api-client');
const {
	getAuthClientConfig,
	createClientCredentialsGrant
} = require('@pins/common/src/client/auth-client');

const config = require('./config');

/** @type {import('openid-client').TokenSet} */
let clientCredentials;

const TEN_MINS_IN_SECONDS = 600;

/**
 * @returns {Promise<string|undefined>}
 */
const getClientCredentials = async () => {
	const now = Math.floor(Date.now() / 1000);

	if (clientCredentials && clientCredentials.expiry) {
		const secondsUntilExpiry = clientCredentials.expiry - now;

		if (secondsUntilExpiry > TEN_MINS_IN_SECONDS) {
			return clientCredentials.access_token;
		}
	}

	await getAuthClientConfig(config.oauth.baseUrl, config.oauth.clientID, config.oauth.clientSecret);

	clientCredentials = await createClientCredentialsGrant();
	clientCredentials.expiry = now + clientCredentials.expires_in;

	return clientCredentials.access_token;
};

const createApiClient = async () => {
	/** @type {import('@pins/common/src/client/appeals-api-client').AuthTokens} */
	const auth = {
		access_token: null,
		id_token: null,
		client_creds: await getClientCredentials()
	};

	return new AppealsApiClient(config.API.HOSTNAME, auth, config.API.TIMEOUT);
};

module.exports = createApiClient;
