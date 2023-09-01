class ApiError {
	constructor(code, message) {
		this.code = code;
		this.message = message;
	}

	// generic
	static badRequest(msg) {
		return new ApiError(400, msg);
	}

	// appeal
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

	// final comments
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

	// lpas
	static lpaNotFound() {
		return new ApiError(404, { errors: [`LPA was not found`] });
	}

	// Users/LPA Dashboard
	static noLpaCodeProvided() {
		return new ApiError(400, { errors: [`No LPA was provided`] });
	}

	static noCaseRefProvided() {
		return new ApiError(400, { errors: [`No Case Ref was provided`] });
	}

	static userNotFound() {
		return new ApiError(404, { errors: [`The user was not found`] });
	}

	static userDisabled() {
		return new ApiError(400, { errors: [`The user was disabled`] });
	}

	static userCantDisableAdmin() {
		return new ApiError(400, { errors: [`Can't disable admin user`] });
	}

	static userOnly1Admin() {
		return new ApiError(400, { errors: [`Only 1 admin is allowed at a time`] });
	}

	static userDuplicate() {
		return new ApiError(400, { errors: [`This user already exists`] });
	}

	static userBadLpa() {
		return new ApiError(400, { errors: [`Can't match this user to the lpa`] });
	}

	// appeals case data
	static appealsCaseDataNotFound() {
		return new ApiError(404, { errors: [`The appeals case data was not found`] });
	}

	// document metadata
	static documentMetadataNotFound(caseRef) {
		return new ApiError(404, { errors: [`The document metadata ${caseRef} was not found`] });
	}

	// questionnaire responses
	static noReferenceIdProvided() {
		return new ApiError(400, { errors: ['No reference id was provided'] });
	}

	static noJourneyIdProvided() {
		return new ApiError(400, { errors: ['No form id was provided'] });
	}

	static unableToUpdateResponse() {
		return new ApiError(400, { errors: ['Unable to update questionnaire response'] });
	}

	static unableToGetResponse() {
		return new ApiError(400, { errors: ['Unable to get questionnaire response'] });
	}
}

module.exports = ApiError;
