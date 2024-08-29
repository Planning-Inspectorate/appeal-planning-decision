const crypto = require('crypto');
const TOKEN_LENGTH = 5;
const BUFFER_LENGTH = 20;

/**
 * @returns {string}
 */
const generateToken = () => {
	return crypto
		.randomBytes(BUFFER_LENGTH)
		.toString('base64')
		.replace(/[^\w_]/g, '')
		.replace(/[AEIOUaeiou0-9]/g, '')
		.slice(0, TOKEN_LENGTH)
		.toUpperCase();
};

/**
 * @returns {string}
 */
const createToken = () => {
	let token = generateToken();
	if (token.length === 5) return token;
	token = generateToken();
	return token;
};

module.exports = {
	createToken
};
