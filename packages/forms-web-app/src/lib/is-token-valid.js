const { checkToken } = require('./appeals-api-wrapper');
const { isTokenExpired } = require('./is-token-expired');
const { utils, enterCodeConfig } = require('@pins/common');
const config = require('../config');

const testConfirmEmailToken = '12345';

const isTestEnvironment = () => config.server.allowTestingOverrides;

/**
 * Check if LPA is System Test Borough Council and token is test token
 * @param {string} token
 * @param {string} lpaCode
 * @return {boolean}
 */
const isTestLpaAndToken = (token, lpaCode) => {
	return utils.isTestLPA(lpaCode) && token === testConfirmEmailToken;
};

/**
 * Check if token is test token
 * @param {string} token
 * @return {boolean}
 */
const isTestToken = (token) => token === testConfirmEmailToken;

/**
 *
 * @param {string|undefined} id
 * @param {string} token
 * @param {string} [emailAddress]
 * @param {any} [session]
 * @returns {Promise<TokenValidResult|import('#lib/appeals-api-wrapper').TokenCheckResult>}
 */
const getToken = async (id, token, emailAddress, session) => {
	let tokenDocument;
	try {
		tokenDocument = await checkToken(id, token, emailAddress);
		return tokenDocument;
	} catch (err) {
		console.log(err);
		// todo: can we improve this to not rely on string matching,
		// handler swallows response and only gives back status message
		if (err.message === 'Too Many Requests') {
			return {
				valid: false,
				action: session?.enterCode?.action,
				tooManyAttempts: true
			};
		} else if (err.message === 'Invalid Token') {
			return {
				valid: false,
				action: session?.enterCode?.action,
				tooManyAttempts: false
			};
		} else {
			throw err;
		}
	}
};

/**
 * @typedef {Object} TokenValidResult
 * @property {boolean} valid
 * @property {string} action
 * @property {Date} [createdAt]
 * @property {boolean} [expired]
 * @property {boolean} [tooManyAttempts]
 */

/**
 * @param {string|undefined} id // todo: reorder param to after token and make optional
 * @param {string} token
 * @param {string} [emailAddress]
 * @param {any} [session] Express request session data
 * @param {boolean} [isTestScenario] is test scenario
 * @returns {Promise<TokenValidResult>}
 */
const isTokenValid = async (id, token, emailAddress, session, isTestScenario) => {
	if (isTestScenario) {
		return {
			valid: true,
			action: enterCodeConfig.actions.confirmEmail
		};
	}

	/** @type {TokenValidResult} */
	let result = {
		valid: false,
		action: ''
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

	let tokenDocument = await getToken(id, token, emailAddress, session);

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
	isTokenValid,
	isTestToken,
	isTestLpaAndToken,
	testConfirmEmailToken,
	isTestEnvironment
};
