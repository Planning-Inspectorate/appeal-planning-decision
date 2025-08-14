const {
	APPEAL_USER_ROLES: { APPELLANT, RULE_6_PARTY },
	LPA_USER_ROLE
} = require('@pins/common/src/constants');
const {
	JOURNEY_TYPE: { appealForm, questionnaire, statement, finalComments, proofEvidence }
} = require('@pins/common/src/dynamic-forms/journey-types');

/**
 * @param {import('@pins/common/src/dynamic-forms/journey-types').JourneyTypesDefinition} journeyType
 * @param {import('@pins/common/src/client/appeals-api-client').AppealsApiClient} api
 * @returns {function(string, object): Promise<any>}
 */
exports.getSaveFunction = (journeyType, api) => {
	const key = `${journeyType.type}_${journeyType.userType}`;
	const saveMethodMap = {
		[`${questionnaire}_${LPA_USER_ROLE}`]: api.patchLPAQuestionnaire?.bind(api),
		[`${appealForm}_${APPELLANT}`]: api.updateAppellantSubmission?.bind(api),
		[`${statement}_${LPA_USER_ROLE}`]: api.patchLPAStatement?.bind(api),
		[`${statement}_${RULE_6_PARTY}`]: api.patchRule6StatementSubmission?.bind(api),
		[`${finalComments}_${APPELLANT}`]: api.patchAppellantFinalCommentSubmission?.bind(api),
		[`${finalComments}_${LPA_USER_ROLE}`]: api.patchLPAFinalCommentSubmission?.bind(api),
		[`${proofEvidence}_${APPELLANT}`]: api.patchAppellantProofOfEvidenceSubmission?.bind(api),
		[`${proofEvidence}_${LPA_USER_ROLE}`]: api.patchLpaProofOfEvidenceSubmission?.bind(api),
		[`${proofEvidence}_${RULE_6_PARTY}`]: api.patchRule6ProofOfEvidenceSubmission?.bind(api)
	};

	const save = saveMethodMap[key];
	if (!save) throw new Error(`No save function found for journey type: ${key}`);
	return save;
};

/**
 * @param {import('@pins/common/src/dynamic-forms/journey-types').JourneyTypesDefinition} journeyType
 * @param {import('@pins/common/src/client/appeals-api-client').AppealsApiClient} api
 * @returns {function(string, Array<Object>): Promise<any>}
 */
exports.getUploadDoumentFunction = (journeyType, api) => {
	const key = `${journeyType.type}_${journeyType.userType}`;

	const saveMethodMap = {
		[`${questionnaire}_${LPA_USER_ROLE}`]: api.postLPASubmissionDocumentUpload?.bind(api),
		[`${appealForm}_${APPELLANT}`]: api.postAppellantSubmissionDocumentUpload?.bind(api),
		[`${statement}_${LPA_USER_ROLE}`]: api.postLPAStatementDocumentUpload?.bind(api),
		[`${statement}_${RULE_6_PARTY}`]: api.postRule6StatementDocumentUpload?.bind(api),
		[`${finalComments}_${APPELLANT}`]: api.postAppellantFinalCommentDocumentUpload?.bind(api),
		[`${finalComments}_${LPA_USER_ROLE}`]: api.postLPAFinalCommentDocumentUpload?.bind(api),
		[`${proofEvidence}_${APPELLANT}`]: api.postAppellantProofOfEvidenceDocumentUpload?.bind(api),
		[`${proofEvidence}_${LPA_USER_ROLE}`]: api.postLpaProofOfEvidenceDocumentUpload?.bind(api),
		[`${proofEvidence}_${RULE_6_PARTY}`]: api.postRule6ProofOfEvidenceDocumentUpload?.bind(api)
	};

	const upload = saveMethodMap[key];
	if (!upload) throw new Error(`No save function found for journey type: ${key}`);
	return upload;
};

/**
 * @param {import('@pins/common/src/dynamic-forms/journey-types').JourneyTypesDefinition} journeyType
 * @param {import('@pins/common/src/client/appeals-api-client').AppealsApiClient} api
 * @returns {function(string, string[]): Promise<any>}
 */
exports.getRemoveDocumentFunction = (journeyType, api) => {
	const key = `${journeyType.type}_${journeyType.userType}`;

	const saveMethodMap = {
		[`${questionnaire}_${LPA_USER_ROLE}`]: api.deleteLPASubmissionDocumentUpload?.bind(api),
		[`${appealForm}_${APPELLANT}`]: api.deleteAppellantSubmissionDocumentUpload?.bind(api),
		[`${statement}_${LPA_USER_ROLE}`]: api.deleteLPAStatementDocumentUpload?.bind(api),
		[`${statement}_${RULE_6_PARTY}`]: api.deleteRule6StatementDocumentUpload?.bind(api),
		[`${finalComments}_${APPELLANT}`]: api.deleteAppellantFinalCommentDocumentUpload?.bind(api),
		[`${finalComments}_${LPA_USER_ROLE}`]: api.deleteLPAFinalCommentDocumentUpload?.bind(api),
		[`${proofEvidence}_${APPELLANT}`]: api.deleteAppellantProofOfEvidenceDocumentUpload?.bind(api),
		[`${proofEvidence}_${LPA_USER_ROLE}`]: api.deleteLpaProofOfEvidenceDocumentUpload?.bind(api),
		[`${proofEvidence}_${RULE_6_PARTY}`]: api.deleteRule6ProofOfEvidenceDocumentUpload?.bind(api)
	};

	const deleteFile = saveMethodMap[key];
	if (!deleteFile) throw new Error(`No delete function found for journey type: ${key}`);
	return deleteFile;
};
