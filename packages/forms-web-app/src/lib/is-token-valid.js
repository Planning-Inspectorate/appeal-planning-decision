const { checkToken } = require('./appeals-api-wrapper');
const { isTokenExpired } = require('./is-token-expired');
const config = require('../config');
const { isTestLPA } = require('@pins/common/src/utils');
const logger = require('#lib/logger');

/**
 * @typedef {Object} TokenValidResult
 * @property {boolean} valid
 * @property {string} [action]
 * @property {Date} [createdAt]
 * @property {boolean} [expired]
 * @property {boolean} [tooManyAttempts]
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
 * @param {string} [id] - appealId or userid
 * @param {string} [emailAddress] - user's email
 * @param {string} [action] - token action
 * @param {string} [lpaCode] - if provided will be included in isTestScenario check
 * @returns {Promise<TokenValidResult>}
 */
const isTokenValid = async (token, id, emailAddress, action, lpaCode) => {
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
