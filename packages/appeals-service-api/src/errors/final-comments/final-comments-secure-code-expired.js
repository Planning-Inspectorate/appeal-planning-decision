const ApiError = require('../apiError');

class FinalCommentsSecureCodeExpired extends ApiError {
	constructor() {
		super(301, '');
	}
}

module.exports = { FinalCommentsSecureCodeExpired };
