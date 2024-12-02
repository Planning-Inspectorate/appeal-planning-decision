const { createDocument } = require('#lib/documents-api-wrapper');
const {
	isObjectWithUploadedFiles,
	removeFilesV2,
	getValidFiles,
	generateDocumentSubmissionId
} = require('#lib/multi-file-upload-helpers');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { mapMultiFileDocumentToSavedDocument } = require('../../mappers/document-mapper');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');

/**
 * @typedef {import('../../dynamic-forms/journey').Journey} Journey
 * @typedef {import('../../dynamic-forms/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../dynamic-forms/section').Section} Section * @typedef {import('../../dynamic-forms/dynamic-components/multi-file-upload/question')} MultiFileUploadQuestion
 */

/**
 * returns the data to send to the DB
 * side effect: modifies journeyResponse with the new answers
 * @this {MultiFileUploadQuestion}
 * @param {import('express').Request} req
 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
 * @returns {Promise<{ answers: Record<string, unknown> } & { uploadedFiles: unknown[] }>}
 */
async function getDataToSave(req, journeyResponse) {
	const {
		body: { errors = {}, errorSummary = [], removedFiles: unparsedRemovedFiles = '' }
	} = req;
	const encodedReferenceId = encodeURIComponent(journeyResponse.referenceId);

	// remove files from response
	if (unparsedRemovedFiles) {
		const removedFiles = JSON.parse(unparsedRemovedFiles);
		const relevantUploadedFiles = this.getRelevantUploadedFiles(journeyResponse);

		const failedRemovedFiles = await removeFilesV2(
			relevantUploadedFiles,
			removedFiles,
			journeyResponse.referenceId,
			`${journeyResponse.journeyId}:${encodedReferenceId}`,
			removeDocuments(req.appealsApiClient, journeyResponse.journeyId)
		);

		// adds validation errors to be checked after
		for (const { storageId, originalFileName } of failedRemovedFiles) {
			const errorMsg = `Failed to remove file: ${originalFileName}`;
			errors[storageId] = {
				value: { name: originalFileName },
				msg: errorMsg
			};
			errorSummary.push({
				text: errorMsg
			});
		}
	}

	// save valid files to blob storage
	const filesToUpload = (() => {
		if (!req.files) return [];
		const relevantRequestFiles = req.files[this.fieldName];
		if (Array.isArray(relevantRequestFiles)) return relevantRequestFiles;
		return [relevantRequestFiles];
	})();
	const validFiles = getValidFiles(errors, filesToUpload);
	const uploadedFiles = await saveFilesToBlobStorage.call(this, validFiles, journeyResponse);

	const journeyFiles = {
		answers: {
			[this.fieldName]: {
				/** @type {unknown[]} */
				uploadedFiles: []
			}
		}
	};

	const answer = journeyResponse.answers[this.fieldName];

	if (isObjectWithUploadedFiles(answer)) {
		journeyFiles.answers[this.fieldName].uploadedFiles.push(...answer.uploadedFiles);
	}

	if (uploadedFiles) {
		journeyFiles.answers[this.fieldName].uploadedFiles.push(...uploadedFiles);
	}

	journeyResponse.answers[this.fieldName] = journeyFiles.answers[this.fieldName];

	if (Object.keys(errors).length > 0) {
		req.body.errors = errors;
		req.body.errorSummary = errorSummary.map((/** @type {any} */ error) => ({
			...error,
			href: `#${this.fieldName}`
		}));
	}

	return {
		answers: {},
		uploadedFiles: journeyFiles.answers[this.fieldName].uploadedFiles
	};
}

/**
 * @this {MultiFileUploadQuestion}
 * @param {import('#lib/multi-file-upload-helpers').File[]} files
 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
 * @returns {Promise<{
 *   message: {
 *     text: string;
 *   };
 *   id: string;
 *   name: string;
 *   fileName: string;
 *   originalFileName: string;
 *   location: string;
 *   size: string;
 * }[]>}
 */
async function saveFilesToBlobStorage(files, journeyResponse) {
	const resolutions = await conjoinedPromises(files, (file) =>
		createDocument(
			{
				id: generateDocumentSubmissionId(journeyResponse),
				referenceNumber: journeyResponse.referenceId
			},
			file,
			file.name,
			this.documentType.name
		)
	);

	const result = Array.from(resolutions).map(([file, document]) =>
		mapMultiFileDocumentToSavedDocument(document, document?.name, file.name)
	);

	return result;
}

/**
 * @param {import('@pins/common/src/client/appeals-api-client').AppealsApiClient} apiClient
 * @param {string} referenceId
 * @param {string} journeyId
 * @param {any} data
 * @returns {Promise<any> | void}
 */
function uploadDocuments(apiClient, referenceId, journeyId, data) {
	switch (journeyId) {
		case JOURNEY_TYPES.HAS_QUESTIONNAIRE: {
			return apiClient.postLPASubmissionDocumentUpload(referenceId, data);
		}
		case JOURNEY_TYPES.HAS_APPEAL_FORM: {
			return apiClient.postAppellantSubmissionDocumentUpload(referenceId, data);
		}
		case JOURNEY_TYPES.S78_QUESTIONNAIRE: {
			return apiClient.postLPASubmissionDocumentUpload(referenceId, data);
		}
		case JOURNEY_TYPES.S78_APPEAL_FORM: {
			return apiClient.postAppellantSubmissionDocumentUpload(referenceId, data);
		}
		case JOURNEY_TYPES.S78_LPA_STATEMENT: {
			return apiClient.postLPAStatementDocumentUpload(referenceId, data);
		}
		case JOURNEY_TYPES.S78_LPA_PROOF_EVIDENCE: {
			return apiClient.postLpaProofOfEvidenceDocumentUpload(referenceId, data);
		}
		case JOURNEY_TYPES.S78_RULE_6_STATEMENT: {
			return apiClient.postRule6StatementDocumentUpload(referenceId, data);
		}
		case JOURNEY_TYPES.S78_APPELLANT_FINAL_COMMENTS: {
			return apiClient.postAppellantFinalCommentDocumentUpload(referenceId, data);
		}
		case JOURNEY_TYPES.S78_LPA_FINAL_COMMENTS: {
			return apiClient.postLPAFinalCommentDocumentUpload(referenceId, data);
		}
		case JOURNEY_TYPES.S78_APPELLANT_PROOF_EVIDENCE: {
			return apiClient.postAppellantProofOfEvidenceDocumentUpload(referenceId, data);
		}
		case JOURNEY_TYPES.S78_RULE_6_PROOF_EVIDENCE: {
			return apiClient.postRule6ProofOfEvidenceDocumentUpload(referenceId, data);
		}
		default:
			throw new Error('Unrecognised journey type');
	}
}

/**
 * @param {import('@pins/common/src/client/appeals-api-client').AppealsApiClient} apiClient
 * @param {string} journeyId
 * @returns {(submissionId: string, documentId: string) => Promise<any>}
 */
function removeDocuments(apiClient, journeyId) {
	return (submissionId, documentId) => {
		switch (journeyId) {
			case JOURNEY_TYPES.HAS_QUESTIONNAIRE: {
				return apiClient.deleteLPASubmissionDocumentUpload(submissionId, documentId);
			}
			case JOURNEY_TYPES.HAS_APPEAL_FORM: {
				return apiClient.deleteAppellantSubmissionDocumentUpload(submissionId, documentId);
			}
			case JOURNEY_TYPES.S78_QUESTIONNAIRE: {
				return apiClient.deleteLPASubmissionDocumentUpload(submissionId, documentId);
			}
			case JOURNEY_TYPES.S78_APPEAL_FORM: {
				return apiClient.deleteAppellantSubmissionDocumentUpload(submissionId, documentId);
			}
			case JOURNEY_TYPES.S78_LPA_STATEMENT: {
				return apiClient.deleteLPAStatementDocumentUpload(submissionId, documentId);
			}
			case JOURNEY_TYPES.S78_RULE_6_STATEMENT: {
				return apiClient.deleteRule6StatementDocumentUpload(submissionId, documentId);
			}
			case JOURNEY_TYPES.S78_APPELLANT_FINAL_COMMENTS: {
				return apiClient.deleteAppellantFinalCommentDocumentUpload(submissionId, documentId);
			}
			case JOURNEY_TYPES.S78_LPA_FINAL_COMMENTS: {
				return apiClient.deleteLPAFinalCommentDocumentUpload(submissionId, documentId);
			}
			case JOURNEY_TYPES.S78_APPELLANT_PROOF_EVIDENCE: {
				return apiClient.deleteAppellantProofOfEvidenceDocumentUpload(submissionId, documentId);
			}
			case JOURNEY_TYPES.S78_LPA_PROOF_EVIDENCE: {
				return apiClient.deleteLpaProofOfEvidenceDocumentUpload(submissionId, documentId);
			}
			case JOURNEY_TYPES.S78_RULE_6_PROOF_EVIDENCE: {
				return apiClient.deleteRule6ProofOfEvidenceDocumentUpload(submissionId, documentId);
			}
			default:
				throw new Error('Unrecognised journey type');
		}
	};
}

/**
 * Save the answer to the question
 * @this {MultiFileUploadQuestion}
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Journey} journey
 * @param {Section} section
 * @param {JourneyResponse} journeyResponse
 * @returns {Promise<void>}
 */
async function saveAction(req, res, journey, section, journeyResponse) {
	// check for saving validation errors
	const saveViewModel = this.checkForSavingErrors(req, section, journey);
	if (saveViewModel) {
		return this.renderAction(res, saveViewModel);
	}

	const previouslyUploadedFiles = this.getRelevantUploadedFiles(journeyResponse);

	const { uploadedFiles } = await getDataToSave.call(this, req, journeyResponse);
	await Promise.all(
		uploadedFiles.map((file) => {
			if (!file) return;

			const data = {
				...file,
				type: this.documentType.name
			};

			return uploadDocuments(
				req.appealsApiClient,
				journeyResponse.referenceId,
				journeyResponse.journeyId,
				data
			);
		})
	);
	const allUploadedFiles = [...previouslyUploadedFiles, ...uploadedFiles].filter(Boolean);
	const isQuestionAnswered = allUploadedFiles.length > 0;
	let responseToSave;
	if (req.body.removedFiles && uploadedFiles.length === 0) {
		responseToSave = {
			answers: {
				[this.fieldName]: null
			}
		};
	} else {
		responseToSave = {
			answers: {
				[this.fieldName]: isQuestionAnswered ? true : null
			}
		};
	}
	await this.saveResponseToDB(req.appealsApiClient, journey.response, responseToSave);

	// move to the next question
	return this.handleNextQuestion(res, journey, section.segment, this.fieldName);
}

module.exports = {
	getDataToSave,
	saveFilesToBlobStorage,
	saveAction
};
