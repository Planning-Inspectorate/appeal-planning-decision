const { checkToken } = require('./appeals-api-wrapper');
const { isTokenExpired } = require('./is-token-expired');

const isTokenValid = async (id, token) => {
	if (!id || typeof id !== 'string' || !token || typeof token !== 'string') {
		return false;
	}

	const tokenDocument = await checkToken(id, token);

	if (tokenDocument === null || typeof tokenDocument !== 'object') {
		return false;
	}

	const tokenCreatedTime = Object.keys(tokenDocument).includes('createdAt')
		? new Date(tokenDocument.createdAt)
		: undefined;

	return (
		tokenDocument?.id === id &&
		typeof tokenCreatedTime !== 'undefined' &&
		!isTokenExpired(30, tokenCreatedTime)
	);
};

module.exports = {
	isTokenValid
};
