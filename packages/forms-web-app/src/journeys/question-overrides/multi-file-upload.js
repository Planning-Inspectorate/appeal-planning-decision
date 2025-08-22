const { createDocument } = require('#lib/documents-api-wrapper');
const {
	isObjectWithUploadedFiles,
	removeFilesV2,
	getValidFiles,
	generateDocumentSubmissionId
} = require('#lib/multi-file-upload-helpers');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { mapMultiFileDocumentToSavedDocument } = require('../../mappers/document-mapper');
const { getJourneyTypeById } = require('@pins/common/src/dynamic-forms/journey-types');
const { getUploadDoumentFunction, getRemoveDocumentFunction } = require('../get-journey-save');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey').Journey} Journey
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('@pins/dynamic-forms/src/section').Section} Section * @typedef {import('@pins/dynamic-forms/src/dynamic-components/multi-file-upload/question')} MultiFileUploadQuestion
 */

/**
 * returns the data to send to the DB
 * side effect: modifies journeyResponse with the new answers
 * @this {MultiFileUploadQuestion}
 * @param {import('express').Request} req
 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
 * @param {{ id: string; type: string; originalFileName: string; storageId: string }[]} previouslyUploadedFiles
 * @returns {Promise<{ answers: Record<string, unknown> } & { uploadedFiles: unknown[] }>}
 */
async function getDataToSave(req, journeyResponse, previouslyUploadedFiles) {
	const {
		body: { errors = {}, errorSummary = [], removedFiles: unparsedRemovedFiles = '' }
	} = req;
	const encodedReferenceId = encodeURIComponent(journeyResponse.referenceId);

	const journeyType = getJourneyTypeById(journeyResponse.journeyId);
	if (!journeyType) throw new Error(`Journey type: ${journeyResponse.journeyId} not found`);

	// get valid files to upload
	const filesToUpload = (() => {
		if (!req.files) return [];
		const relevantRequestFiles = req.files[this.fieldName];
		if (Array.isArray(relevantRequestFiles)) return relevantRequestFiles;
		return [relevantRequestFiles];
	})();
	const validFiles = getValidFiles(errors, filesToUpload);

	// get a list of fileNames in validFiles that exist in previouslyUploadedFiles
	const replacedFiles = validFiles.filter((file) =>
		previouslyUploadedFiles.some((previousFile) => previousFile.originalFileName === file.name)
	);

	const removedFiles = unparsedRemovedFiles ? JSON.parse(unparsedRemovedFiles) : [];

	// combine removed and replaced files
	const allNames = [...removedFiles, ...replacedFiles].map((file) => file.name);
	const uniqueNames = Array.from(new Set(allNames));
	const filesToRemove = uniqueNames.map((name) => ({ name }));

	// remove files
	if (filesToRemove && filesToRemove.length) {
		const relevantUploadedFiles = this.getRelevantUploadedFiles(journeyResponse);

		const removeDocuments = getRemoveDocumentFunction(journeyType, req.appealsApiClient);

		const failedRemovedFiles = await removeFilesV2(
			relevantUploadedFiles,
			filesToRemove,
			journeyResponse.referenceId,
			`${journeyResponse.journeyId}:${encodedReferenceId}`,
			removeDocuments
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
 * Save the answer to the question
 * @this {MultiFileUploadQuestion}
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {function(string, Object): Promise<any>} saveFunction
 * @param {Journey} journey
 * @param {Section} section
 * @param {JourneyResponse} journeyResponse
 * @returns {Promise<void>}
 */
async function saveAction(req, res, saveFunction, journey, section, journeyResponse) {
	const previouslyUploadedFiles = this.getRelevantUploadedFiles(journeyResponse);

	const { uploadedFiles } = await getDataToSave.call(
		this,
		req,
		journeyResponse,
		previouslyUploadedFiles
	);

	const updatedUploadedFiles = this.getRelevantUploadedFiles(journeyResponse);

	const journeyType = getJourneyTypeById(journeyResponse.journeyId);
	if (!journeyType) throw new Error(`Journey type: ${journeyResponse.journeyId} not found`);
	const uploadDocuments = getUploadDoumentFunction(journeyType, req.appealsApiClient);

	const filesToAttach = uploadedFiles
		.map((file) => {
			if (!file) return;
			return {
				...file,
				type: this.documentType.name
			};
		})
		.filter(Boolean);

	if (filesToAttach.length) {
		await uploadDocuments(journeyResponse.referenceId, filesToAttach);
	}

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

	await saveFunction(journeyResponse.referenceId, responseToSave.answers);

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
