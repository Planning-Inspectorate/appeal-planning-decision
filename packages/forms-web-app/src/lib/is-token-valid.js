const { checkToken } = require('./appeals-api-wrapper');
const { isTokenExpired } = require('./is-token-expired');
const { utils, enterCodeConfig } = require('@pins/common');
const config = require('../config');

const testConfirmEmailToken = '12345';

const isTokenValid = async (id, token, session) => {
	let result = {
		valid: false,
		action: ''
	};

	if (!id || typeof id !== 'string' || !token || typeof token !== 'string') {
		return result;
	}

	// is test LPA + Test environment + test token
	// then allow through as a confirm email token
	if (
		config.server.allowTestingOverrides &&
		utils.isTestLPA(session?.appeal?.lpaCode) &&
		token === testConfirmEmailToken
	) {
		result.valid = true;
		result.action = enterCodeConfig.actions.confirmEmail;
		return result;
	}

	let tokenDocument;
	try {
		tokenDocument = await checkToken(id, token);
	} catch (err) {
		// todo: can we improve this to not rely on string matching,
		// handler swallows response and only gives back status message
		if (err.message === 'Too Many Requests') {
			result.tooManyAttempts = true;
			return result;
		} else {
			throw err;
		}
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
	testConfirmEmailToken
};
