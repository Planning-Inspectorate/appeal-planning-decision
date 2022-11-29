const ApiError = require('../apiError');

class FinalCommentSecureCodeIncorrectError extends ApiError {
	constructor() {
		super(403, '');
	}
}

module.exports = { FinalCommentSecureCodeIncorrectError };
