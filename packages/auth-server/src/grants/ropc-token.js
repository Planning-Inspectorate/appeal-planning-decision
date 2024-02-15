import crypto from 'crypto';
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
		.replace(/[AEIOUaeiou0]/g, '')
		.slice(0, TOKEN_LENGTH);
};

/**
 * @returns {string}
 */
export const createToken = () => {
	let token = generateToken();
	if (token.length === 5) return token;
	token = generateToken();
	return token;
};
