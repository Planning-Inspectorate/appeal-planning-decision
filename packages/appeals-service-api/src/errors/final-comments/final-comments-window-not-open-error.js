const ApiError = require('../apiError');

class FinalCommentsWindowNotOpenError extends ApiError {
	constructor() {
		super(403, "The appeal you're trying to access is closed for comments");
	}
}

module.exports = { FinalCommentsWindowNotOpenError };
