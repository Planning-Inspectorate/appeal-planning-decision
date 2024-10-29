const config = require('../config');
const { AUTH } = require('@pins/common/src/constants');
const { getAuthClient } = require('@pins/common/src/client/auth-client');
const logger = require('#lib/logger');

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
		logger.info(err, 'bad token entry');
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
 * @param {string} [emailAddress] - user's email
 * @param {string} [action] - token action
 * @returns {Promise<TokenValidResult>}
 */
const isTokenValid = async (token, emailAddress, action) => {
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
	if (!isNonEmptyString(emailAddress)) return result;

	return await getAuthToken(token, emailAddress, action);
};

module.exports = {
	isTokenValid
};
