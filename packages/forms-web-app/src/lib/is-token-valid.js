const { checkToken } = require('./appeals-api-wrapper');
const { isTokenExpired } = require('./is-token-expired');
const { utils } = require('@pins/common');
const config = require('../config');

const testConfirmEmailToken = '12345';

const isTestEnvironment = () => config.server.allowTestingOverrides;

// is test LPA + Test environment + test token
// then allow through as a confirm email token
const isTestLPACheckTokenAndSession = (token, session) => {
	return utils.isTestLPA(session?.appeal?.lpaCode) && token === testConfirmEmailToken;
};

const getToken = async (id, token, session) => {
	let tokenDocument;
	try {
		tokenDocument = await checkToken(id, token);
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
		} else {
			throw err;
		}
	}
};

const isTokenValid = async (id, token, session) => {
	let result = {
		valid: false,
		action: ''
	};

	if (!id || typeof id !== 'string' || !token || typeof token !== 'string') return result;

	let tokenDocument = await getToken(id, token, session);

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
	isTestLPACheckTokenAndSession,
	testConfirmEmailToken,
	isTestEnvironment
};
