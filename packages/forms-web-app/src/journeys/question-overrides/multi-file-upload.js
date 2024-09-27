/**
 * @typedef {import('../../dynamic-forms/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../dynamic-forms/dynamic-components/multi-file-upload/question')} MultiFileUploadQuestion
 */

const {
	isObjectWithUploadedFiles,
	removeFilesV2,
	getValidFiles
} = require('#lib/multi-file-upload-helpers');

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
			this.removeDocuments(req.appealsApiClient, journeyResponse.journeyId)
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
	const uploadedFiles = await this.saveFilesToBlobStorage(validFiles, journeyResponse);

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

module.exports = {
	getDataToSave
};
