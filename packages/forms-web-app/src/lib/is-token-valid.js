const { checkToken } = require('./appeals-api-wrapper');
const { isTokenExpired } = require('./is-token-expired');
const config = require('../config');
const { isTestLPA } = require('@pins/common/src/utils');
const logger = require('#lib/logger');
const oidcClient = require('openid-client');

let authClient;
async function getAuthClient() {
	if (!authClient) {
		const issuer = await oidcClient.Issuer.discover(
			'http://auth-server:3000/oidc/.well-known/openid-configuration'
		);

		authClient = new issuer.Client({
			client_id: config.oauth.clientID,
			client_secret: config.oauth.clientSecret,
			//redirect_uris: ['http://localhost:9003/debug/oidc'],
			response_types: ['code'],
			token_endpoint_auth_method: 'client_secret_jwt'
		});
	}

	return authClient;
}

/**
 * @typedef {Object} TokenValidResult
 * @property {boolean} valid
 * @property {string} [action]
 * @property {Date} [createdAt]
 * @property {boolean} [expired]
 * @property {boolean} [tooManyAttempts]
 * @property {string} [access_token]
 * @property {string} [id_token]
 */

/**
 * Check if token is test token
 * @param {string} token
 * @return {boolean}
 */
const isTestToken = (token) => token === '12345';

/**
 * Checks if app is running in a test environment
 * @return {boolean}
 */
const isTestEnvironment = () => config.server.allowTestingOverrides;

/**
 * @param {string} token
 * @param {string} [id]
 * @param {string} [emailAddress]
 * @param {string} [action]
 * @returns {Promise<TokenValidResult|import('#lib/appeals-api-wrapper').TokenCheckResult>}
 */
const getToken = async (token, id, emailAddress, action) => {
	let tokenDocument;
	try {
		tokenDocument = await checkToken(token, id, emailAddress);
		return tokenDocument;
	} catch (err) {
		logger.error(err, 'Failed token check');

		// todo: can we improve this to not rely on string matching,
		// handler swallows response and only gives back status message
		if (err.message === 'Too Many Requests') {
			return {
				valid: false,
				action: action,
				tooManyAttempts: true
			};
		} else if (err.message === 'Invalid Token') {
			return {
				valid: false,
				action: action,
				tooManyAttempts: false
			};
		} else {
			throw err;
		}
	}
};

/**
 * @param {string} token
 * @param {string} [emailAddress]
 * @param {string} [action]
 * @returns {Promise<TokenValidResult>}
 */
const authToken = async (token, emailAddress, action) => {
	const tooManyAttempts = {
		valid: false,
		action: action,
		tooManyAttempts: true
	};
	const invalidCode = {
		valid: false,
		action: action
	};
	const codeExpired = {
		valid: false,
		action: action,
		expired: true
	};
	const valid = {
		valid: true,
		action: action
	};

	const client = await getAuthClient();
	try {
		const authResult = await client.grant({
			grant_type: 'ropc-otp',
			email: emailAddress,
			otp: token,
			scope: 'openid email',
			resource: 'appeals-front-office'
		});

		valid.access_token = authResult.access_token;
		valid.id_token = authResult.id_token;
		return valid;
	} catch (err) {
		if (err?.response?.statusCode === 429) {
			return tooManyAttempts;
		}
		if (err?.response?.statusMessage === 'IncorrectCode') {
			return invalidCode;
		}
		if (err?.response?.statusMessage === 'CodeExpired') {
			return codeExpired;
		}
		throw err;
	}
};

/**
 * @param {string} token
 * @param {string} [id] - appealId
 * @param {string} [emailAddress] - user's email
 * @param {string} [action] - token action
 * @param {string} [lpaCode] - if provided will be included in isTestScenario check
 * @param {boolean} [enrolUsersFlag]
 * @returns {Promise<TokenValidResult>}
 */
const isTokenValid = async (token, id, emailAddress, action, lpaCode, enrolUsersFlag) => {
	const isTestScenario =
		isTestEnvironment() && isTestToken(token) && (!lpaCode || isTestLPA(lpaCode));
	if (isTestScenario) {
		return {
			valid: true
		};
	}

	/** @type {TokenValidResult} */
	let result = {
		valid: false
	};

	/**
	 * @param {any} val
	 * @returns {boolean}
	 */
	const isNonEmptyString = (val) => {
		return val && typeof val === 'string';
	};

	if (!isNonEmptyString(token)) return result;
	if (!isNonEmptyString(id) && !isNonEmptyString(emailAddress)) return result;

	// use auth token going forward
	if (enrolUsersFlag) {
		return await authToken(token, emailAddress, action);
	}

	// legacy path
	let tokenDocument = await getToken(token, id, emailAddress, action);

	if (tokenDocument && 'tooManyAttempts' in tokenDocument && tokenDocument.tooManyAttempts) {
		return tokenDocument;
	}

	if (tokenDocument === null || typeof tokenDocument !== 'object') {
		return result;
	}

	const tokenCreatedTime = Object.keys(tokenDocument).includes('createdAt')
		? new Date(tokenDocument.createdAt)
		: undefined;

	result.expired = isTokenExpired(30, tokenCreatedTime);

	result.valid =
		tokenDocument?.id === id && typeof tokenCreatedTime !== 'undefined' && !result.expired;

	result.action = tokenDocument.action;

	return result;
};

module.exports = {
	isTokenValid
};
