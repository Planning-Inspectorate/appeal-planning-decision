class ApiError {
	constructor(code, message) {
		this.code = code;
		this.message = message;
	}

	static badRequest(msg) {
		return new ApiError(400, msg);
	}

	static appealNotFound(id) {
		return new ApiError(404, { errors: [`The appeal ${id} was not found`] });
	}

	static appealNotFoundHorizonId(horizonId) {
		return new ApiError(404, {
			errors: [`The appeal with horizon id of ${horizonId} was not found`]
		});
	}
	static appealsNotFound() {
		return new ApiError(404, { errors: [`The appeals were not found`] });
	}

	static notSameId() {
		return new ApiError(409, {
			errors: ['The provided id in path must be the same as the appeal id in the request body']
		});
	}

	static appealAlreadySubmitted() {
		return new ApiError(409, { errors: ['Cannot update appeal that is already SUBMITTED'] });
	}

	static finalCommentAlreadySubmitted() {
		return new ApiError(409, { errors: [`Cannot submit more than one final comment per email`] });
	}

	static finalCommentHasExpired() {
		return new ApiError(409, { errors: ['Final comment submission window is closed'] });
	}

	static finalCommentsNotFound() {
		return new ApiError(404, { errors: [`The final comments were not found`] });
	}
	static caseDataNotFound() {
		return new ApiError(404, { errors: [`Horizon appeal data was not found`] });
	}
	static caseHasNoFinalCommentsExpiryDate() {
		return new ApiError(409, { errors: ['Appeal does not have a final comments expiry date'] });
	}
}

module.exports = ApiError;
