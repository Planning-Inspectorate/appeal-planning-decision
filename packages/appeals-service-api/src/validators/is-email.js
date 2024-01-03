const { param } = require('express-validator');

/**
 *
 * @param {string} [key]
 * @returns {import('express-validator').ValidationChain[]}
 */
function isEmail(key = 'email') {
	return [
		param(key)
			.isEmail({
				allow_display_name: false,
				require_tld: true
			})
			.bail()
	];
}

module.exports = {
	isEmail
};
