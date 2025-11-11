/**
 * @typedef {Object} ErrorMessages
 * @property {Array.<string>} errors
 */

class ApiError {
	/**
	 * @param {number} code
	 * @param {ErrorMessages} messages
	 */
	constructor(code, messages) {
		this.code = code;
		this.message = messages;
	}

	/**
	 * @param {String|ErrorMessages|undefined} message
	 * @returns {ErrorMessages}
	 */
	static buildErrorFormat(message) {
		if (!message) return { errors: [] };

		return typeof message === 'string' ? { errors: [message] } : message;
	}

	// generic

	/**
	 * @param {number} code
	 * @param {string|ErrorMessages} message
	 */
	static withMessage(code, message) {
		return new ApiError(code, ApiError.buildErrorFormat(message));
	}

	/**
	 * @param {string|ErrorMessages} [msg]
	 */
	static badRequest(msg) {
		return new ApiError(400, ApiError.buildErrorFormat(msg));
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

	static appealDuplicate() {
		return new ApiError(400, { errors: [`This appeal already exists`] });
	}

	static appealDuplicateLegacyAppealSubmissionId() {
		return new ApiError(400, {
			errors: [`There are multiple appeals with this legacy appeal submission id`]
		});
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

	static unableToSubmitFinalCommentResponse() {
		return new ApiError(400, { errors: ['Unable to submit final comment response'] });
	}

	// lpas
	static lpaNotFound() {
		return new ApiError(404, { errors: [`LPA was not found`] });
	}

	static lpaUpsertFailure() {
		return new ApiError(400, { errors: [`LPA list insert failed`] });
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

	static invalidRole() {
		return new ApiError(400, { errors: [`Invalid Role`] });
	}

	// Token
	static invalidToken() {
		return new ApiError(400, { errors: [`Invalid Token`] });
	}

	static forbidden() {
		return new ApiError(403, { errors: [`forbidden`] });
	}

	// appeals case data
	static appealsCaseDataNotFound() {
		return new ApiError(404, { errors: [`The appeals case data was not found`] });
	}

	// document metadata
	static documentMetadataNotFound(caseRef) {
		return new ApiError(404, { errors: [`The document metadata ${caseRef} was not found`] });
	}

	// questionnaire / submission responses
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

	static unableToSubmitResponse() {
		return new ApiError(400, { errors: ['Unable to submit questionnaire response'] });
	}

	static questionnaireNotFound() {
		return new ApiError(404, {
			errors: ['Unable to locate questionnaire']
		});
	}

	static questionnaireDownloadDetailsNotFound() {
		return new ApiError(404, {
			errors: ['Unable to locate questionnaire download details']
		});
	}

	static unableToCreateQuestionnaire() {
		return new ApiError(400, {
			errors: ['Unable to create questionnaire']
		});
	}

	static unableToGetDocumentUploads() {
		return new ApiError(404, {
			errors: ['Unable to retrieve document uploads']
		});
	}

	static unableToCreateDocumentUpload() {
		return new ApiError(400, {
			errors: ['Unable to create document upload']
		});
	}

	static unableToDeleteDocumentUpload() {
		return new ApiError(400, {
			errors: ['Unable to delete document upload']
		});
	}

	static unableToGetAddresses() {
		return new ApiError(404, {
			errors: ['Unable to get SubmissionAddress entries']
		});
	}

	static unableToCreateAddress() {
		return new ApiError(400, {
			errors: ['Unable to create new SubmissionAddress entry']
		});
	}

	static unableToDeleteAddress() {
		return new ApiError(400, {
			errors: ['Unable to delete SubmissionAddress entry']
		});
	}

	static unableToCreateLinkedCase() {
		return new ApiError(400, {
			errors: ['Unable to create new SubmissionLinkedCase entry']
		});
	}

	static unableToDeleteLinkedCase() {
		return new ApiError(400, {
			errors: ['Unable to delete SubmissionLinkedCase entry']
		});
	}

	static unableToCreateListedBuilding() {
		return new ApiError(400, {
			errors: ['Unable to create new SubmissionListedBuilding entry']
		});
	}

	static unableToDeleteListedBuilding() {
		return new ApiError(400, {
			errors: ['Unable to delete SubmissionListedBuilding entry']
		});
	}

	static unableToCreateIndividual() {
		return new ApiError(400, {
			errors: ['Unable to create new SubmissionIndividual entry']
		});
	}

	static unableToDeleteIndividual() {
		return new ApiError(400, {
			errors: ['Unable to delete SubmissionIndividual entry']
		});
	}

	// proofs evidence

	static proofEvidenceNotFound() {
		return new ApiError(404, { errors: [`The proof of evidence was not found`] });
	}

	static unableToSubmitProofEvidenceResponse() {
		return new ApiError(400, { errors: ['Unable to submit proof of evidence response'] });
	}

	//statements

	static statementsNotFound() {
		return new ApiError(404, { errors: [`The statement was not found`] });
	}

	static unableToSubmitStatementsResponse() {
		return new ApiError(400, { errors: ['Unable to submit statements response'] });
	}

	// listed building
	static listedBuildingNotFound(reference) {
		return new ApiError(404, { errors: [`The listedBuilding ${reference} was not found`] });
	}

	// appellant submission
	/**
	 * @param {string} reference
	 * @returns {ApiError}
	 */
	static appellantSubmissionNotFound(reference) {
		return new ApiError(404, { errors: [`The appellant submission ${reference} was not found`] });
	}

	static unableToSubmitAppellantSubmission() {
		return new ApiError(400, { errors: ['Unable to submit appellant submission'] });
	}

	static unableToCreateAndFindIpComment() {
		return new ApiError(404, { errors: ['Unable to create and find Interested Party Comment'] });
	}

	static unableToSubmitIpComment() {
		return new ApiError(400, { errors: ['Unable to submit Interested Party Comment'] });
	}

	/**
	 * @param {string} documentId
	 * @returns {ApiError}
	 */
	static documentDetailsNotFound(documentId) {
		return new ApiError(404, { errors: [`The document detail for ${documentId} were not found`] });
	}
}

module.exports = ApiError;
