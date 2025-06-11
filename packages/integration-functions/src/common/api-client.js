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
	if (clientCredentials && clientCredentials.expires_in) {
		if (clientCredentials.expires_in > TEN_MINS_IN_SECONDS) {
			return clientCredentials.access_token;
		}
	}

	await getAuthClientConfig(config.oauth.baseUrl, config.oauth.clientID, config.oauth.clientSecret);

	clientCredentials = await createClientCredentialsGrant();

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
