const { AppealsApiClient } = require('@pins/common/src/client/appeals-api-client');
const { DocumentsApiClient } = require('@pins/common/src/client/documents-api-client');
const {
	getAuthClientConfig,
	createClientCredentialsGrant
} = require('@pins/common/src/client/auth-client');

const { getUserFromSession } = require('../services/user.service');
const config = require('../config');

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

/**
 * @type {import('express').Handler}
 */
const createApiClients = async (req, res, next) => {
	const user = getUserFromSession(req);

	/** @type {import('@pins/common/src/client/appeals-api-client').AuthTokens} */
	const auth = {
		access_token: user?.access_token,
		id_token: user?.id_token,
		client_creds: undefined
	};

	if (!auth.access_token) {
		auth.client_creds = await getClientCredentials();
	}

	req.appealsApiClient = new AppealsApiClient(config.appeals.url, auth, config.appeals.timeout);
	req.docsApiClient = new DocumentsApiClient(config.documents.url, auth, config.documents.timeout);

	next();
};

module.exports = {
	createApiClients,
	getClientCredentials
};
