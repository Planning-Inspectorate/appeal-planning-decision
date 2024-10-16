const { checkToken } = require('./appeals-api-wrapper');
const { isTokenExpired } = require('./is-token-expired');
const config = require('../config');
const logger = require('#lib/logger');

const { isTestLPA } = require('@pins/common/src/utils');
const { AUTH } = require('@pins/common/src/constants');
const { getAuthClient } = require('@pins/common/src/client/auth-client');

/**
 * @typedef {Object} TokenValidResult
 * @property {boolean} valid
 * @property {string} [action]
 * @property {Date} [createdAt]
 * @property {boolean} [expired]
 * @property {boolean} [tooManyAttempts]
 * @property {string} [access_token]
 * @property {Date} [access_token_expiry]
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
const getAuthToken = async (token, emailAddress, action) => {
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

	const client = await getAuthClient(
		config.oauth.baseUrl,
		config.oauth.clientID,
		config.oauth.clientSecret
	);

	try {
		const authResult = await client.grant({
			grant_type: AUTH.GRANT_TYPE.ROPC,
			email: emailAddress,
			otp: token,
			scope: 'openid email',
			resource: AUTH.RESOURCE
		});

		valid.access_token = authResult.access_token;
		valid.id_token = authResult.id_token;
		valid.access_token_expiry = new Date(authResult.expires_at * 1000); // seconds to ms
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
 * @param {boolean} [sqlUsersFlag]
 * @returns {Promise<TokenValidResult>}
 */
const isTokenValid = async (token, id, emailAddress, action, lpaCode, sqlUsersFlag) => {
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
	if (sqlUsersFlag) {
		return await getAuthToken(token, emailAddress, action);
	}

	// legacy path
	const isTestScenario =
		isTestEnvironment() && isTestToken(token) && (!lpaCode || isTestLPA(lpaCode));
	if (isTestScenario) {
		return {
			valid: true
		};
	}

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
