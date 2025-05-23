const { createDocument } = require('#lib/documents-api-wrapper');
const {
	isObjectWithUploadedFiles,
	removeFilesV2,
	getValidFiles,
	generateDocumentSubmissionId
} = require('#lib/multi-file-upload-helpers');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { mapMultiFileDocumentToSavedDocument } = require('../../mappers/document-mapper');
const {
	JOURNEY_TYPE,
	getJourneyTypeById
} = require('@pins/common/src/dynamic-forms/journey-types');
const {
	APPEAL_USER_ROLES: { APPELLANT, RULE_6_PARTY },
	LPA_USER_ROLE
} = require('@pins/common/src/constants');

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

		const failedRemovedFileNames = failedRemovedFiles.map((x) => x.originalFileName);

		const successfullyRemovedFileNames = removedFiles
			.filter((removedFile) => !failedRemovedFileNames.includes(removedFile.name))
			.map((x) => x.name);

		const updatedSubmissionDocs = journeyResponse.answers.SubmissionDocumentUpload.filter(
			(docUpload) => !successfullyRemovedFileNames.includes(docUpload.originalFileName)
		);

		journeyResponse.answers.SubmissionDocumentUpload = updatedSubmissionDocs;

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
	const journeyType = getJourneyTypeById(journeyId);

	if (!journeyType) throw new Error(`Journey type: ${journeyId} not found`);

	const key = `${journeyType.type}_${journeyType.userType}`;

	const saveMethodMap = {
		[`${JOURNEY_TYPE.questionnaire}_${LPA_USER_ROLE}`]:
			apiClient.postLPASubmissionDocumentUpload?.bind(apiClient),
		[`${JOURNEY_TYPE.appealForm}_${APPELLANT}`]:
			apiClient.postAppellantSubmissionDocumentUpload?.bind(apiClient),
		[`${JOURNEY_TYPE.statement}_${LPA_USER_ROLE}`]:
			apiClient.postLPAStatementDocumentUpload?.bind(apiClient),
		[`${JOURNEY_TYPE.statement}_${RULE_6_PARTY}`]:
			apiClient.postRule6StatementDocumentUpload?.bind(apiClient),
		[`${JOURNEY_TYPE.finalComments}_${APPELLANT}`]:
			apiClient.postAppellantFinalCommentDocumentUpload?.bind(apiClient),
		[`${JOURNEY_TYPE.finalComments}_${LPA_USER_ROLE}`]:
			apiClient.postLPAFinalCommentDocumentUpload?.bind(apiClient),
		[`${JOURNEY_TYPE.proofEvidence}_${APPELLANT}`]:
			apiClient.postAppellantProofOfEvidenceDocumentUpload?.bind(apiClient),
		[`${JOURNEY_TYPE.proofEvidence}_${LPA_USER_ROLE}`]:
			apiClient.postLpaProofOfEvidenceDocumentUpload?.bind(apiClient),
		[`${JOURNEY_TYPE.proofEvidence}_${RULE_6_PARTY}`]:
			apiClient.postRule6ProofOfEvidenceDocumentUpload?.bind(apiClient)
	};

	const save = saveMethodMap[key];
	if (!save) throw new Error(`No save function found for journey type: ${key}`);
	return save(referenceId, data);
}

/**
 * @param {import('@pins/common/src/client/appeals-api-client').AppealsApiClient} apiClient
 * @param {string} journeyId
 * @returns {(submissionId: string, documentId: string) => Promise<any>}
 */
function removeDocuments(apiClient, journeyId) {
	return (submissionId, documentId) => {
		const journeyType = getJourneyTypeById(journeyId);

		if (!journeyType) throw new Error(`Journey type: ${journeyId} not found`);

		const key = `${journeyType.type}_${journeyType.userType}`;

		const saveMethodMap = {
			[`${JOURNEY_TYPE.questionnaire}_${LPA_USER_ROLE}`]:
				apiClient.deleteLPASubmissionDocumentUpload?.bind(apiClient),
			[`${JOURNEY_TYPE.appealForm}_${APPELLANT}`]:
				apiClient.deleteAppellantSubmissionDocumentUpload?.bind(apiClient),
			[`${JOURNEY_TYPE.statement}_${LPA_USER_ROLE}`]:
				apiClient.deleteLPAStatementDocumentUpload?.bind(apiClient),
			[`${JOURNEY_TYPE.statement}_${RULE_6_PARTY}`]:
				apiClient.deleteRule6StatementDocumentUpload?.bind(apiClient),
			[`${JOURNEY_TYPE.finalComments}_${APPELLANT}`]:
				apiClient.deleteAppellantFinalCommentDocumentUpload?.bind(apiClient),
			[`${JOURNEY_TYPE.finalComments}_${LPA_USER_ROLE}`]:
				apiClient.deleteLPAFinalCommentDocumentUpload?.bind(apiClient),
			[`${JOURNEY_TYPE.proofEvidence}_${APPELLANT}`]:
				apiClient.deleteAppellantProofOfEvidenceDocumentUpload?.bind(apiClient),
			[`${JOURNEY_TYPE.proofEvidence}_${LPA_USER_ROLE}`]:
				apiClient.deleteLpaProofOfEvidenceDocumentUpload?.bind(apiClient),
			[`${JOURNEY_TYPE.proofEvidence}_${RULE_6_PARTY}`]:
				apiClient.deleteRule6ProofOfEvidenceDocumentUpload?.bind(apiClient)
		};

		const deleteFile = saveMethodMap[key];
		if (!deleteFile) throw new Error(`No delete function found for journey type: ${key}`);
		return deleteFile(submissionId, documentId);
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
	const previouslyUploadedFiles = this.getRelevantUploadedFiles(journeyResponse);

	const { uploadedFiles } = await getDataToSave.call(this, req, journeyResponse);

	const updatedUploadedFiles = this.getRelevantUploadedFiles(journeyResponse);

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
	const allUploadedFiles = [...updatedUploadedFiles, ...uploadedFiles].filter(Boolean);
	const isQuestionAnswered = allUploadedFiles.length > 0;

	const removedAllPreviousFiles = req.body.removedFiles?.length === previouslyUploadedFiles.length;

	let responseToSave;
	if (removedAllPreviousFiles && uploadedFiles.length === 0) {
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

	// check for saving validation errors
	const saveViewModel = this.checkForSavingErrors(req, section, journey);
	if (saveViewModel) {
		return this.renderAction(res, saveViewModel);
	}

	// move to the next question
	return this.handleNextQuestion(res, journey, section.segment, this.fieldName);
}

module.exports = {
	getDataToSave,
	saveFilesToBlobStorage,
	saveAction
};
