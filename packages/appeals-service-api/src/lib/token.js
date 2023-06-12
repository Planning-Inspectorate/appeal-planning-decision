const crypto = require('crypto');
const TOKEN_LENGTH = 5;
const BUFFER_LENGTH = 20;
const createToken = () => {
	return crypto
		.randomBytes(BUFFER_LENGTH)
		.toString('base64')
		.replace(/[^\w_]/g, '')
		.slice(0, TOKEN_LENGTH);
};

module.exports = {
	createToken
};
