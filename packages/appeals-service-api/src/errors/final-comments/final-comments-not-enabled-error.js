const ApiError = require('../apiError');

class FinalCommentsNotEnabledError extends ApiError {
	constructor(caseReference) {
		super(
			404,
			`Final comments for an appeal with case reference ${caseReference} are not enabled.`
		);
	}
}

module.exports = { FinalCommentsNotEnabledError };
