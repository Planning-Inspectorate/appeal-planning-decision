const crypto = require('crypto');
const TOKEN_LENGTH = 5;
const BUFFER_LENGTH = 20;
const createToken = () => {
	let token = crypto
		.randomBytes(BUFFER_LENGTH)
		.toString('base64')
		.replace(/[^\w_]/g, '')
		.replace(/[AEIOUaeiou]/g, '')
		.slice(0, TOKEN_LENGTH);

	if (token.length === 5) return token;

	token = crypto
		.randomBytes(BUFFER_LENGTH)
		.toString('base64')
		.replace(/[^\w_]/g, '')
		.replace(/[AEIOUaeiou]/g, '')
		.slice(0, TOKEN_LENGTH);

	return token;
};

module.exports = {
	createToken
};
