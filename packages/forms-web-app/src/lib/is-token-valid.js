const config = require('../config');
const { getAuthClientConfig, createROPCGrant } = require('@pins/common/src/client/auth-client');
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
 * @param {string[]} [additionalScopes]
 * @returns {Promise<TokenValidResult>}
 */
const getAuthToken = async (token, emailAddress, action, additionalScopes) => {
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

	await getAuthClientConfig(config.oauth.baseUrl, config.oauth.clientID, config.oauth.clientSecret);

	try {
		const authResult = await createROPCGrant(emailAddress, token, additionalScopes);

		valid.access_token = authResult.access_token;
		valid.id_token = authResult.id_token;
		const expiresIn = authResult.expires_in * 1000; // seconds to ms
		valid.access_token_expiry = new Date(Date.now() + expiresIn);
		return valid;
	} catch (err) {
		logger.info(err, 'bad token entry');
		if (err?.error === 'too_many_attempts') {
			return tooManyAttempts;
		}
		if (err?.error === 'incorrect_code') {
			return invalidCode;
		}
		if (err?.error === 'code_expired') {
			return codeExpired;
		}
		throw err;
	}
};

/**
 * @param {string} token
 * @param {string} [emailAddress] - user's email
 * @param {string} [action] - token action
 * @param {string[]} [additionalScopes]
 * @returns {Promise<TokenValidResult>}
 */
const isTokenValid = async (token, emailAddress, action, additionalScopes) => {
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

	return await getAuthToken(token, emailAddress, action, additionalScopes);
};

module.exports = {
	isTokenValid
};
