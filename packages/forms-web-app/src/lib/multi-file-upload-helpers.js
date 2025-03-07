const { removeDocument } = require('../lib/documents-api-wrapper');
const logger = require('./logger');

/**
 * @typedef {import('../dynamic-forms/journey-response').JourneyResponse} JourneyResponse
 */

/**
 * @typedef {{ name: string, tempFilePath: string }} File
 * @param {{ value: File }[]} errors
 * @param {File[]} files
 * @returns {File[]}
 */
const getValidFiles = (errors, files) => {
	// This function is called after the req has passed through validation middleware.
	// There can be valid and invalid files in a multi-file upload, and the valid files need
	// uploading, whilst the invalid ones do not. We will determine the valid files from the
	// validation `errors` object. During testing it was found `md5` is sometimes not unique(!)
	// though `tempFilePath` does appear to always be unique due to its use of timestamps.

	/**
	 * @type string[]
	 */
	const init = [];

	/**
	 * @type string[]
	 */
	const erroredFilesByTempFilePath = Object.values(errors).reduce((acc, error) => {
		if (!error.value?.tempFilePath) {
			return acc;
		}
		return [...acc, error.value.tempFilePath];
	}, init);
	return files.filter((file) => erroredFilesByTempFilePath.includes(file.tempFilePath) === false);
};

/**
 * Removes files from the array and optionally blob storage
 * @param {Array.<{ id: string, originalFileName: string }>} files - all of the current files
 * @param {Array.<{ name: string }>} removedFiles - the files selected to be removed,
 * @param {string} [baseLocation] - if set this will attempt to remove the file id from blob storage in the location baseLocation/file.id
 *
 * @returns {Promise.<Array.<Object>>} the remaining files after removal, if a file failed to be removed a property is added {failedToRemove: true}
 */
const removeFiles = async (files, removedFiles, baseLocation) => {
	const remainingFiles = [];
	const removePromises = [];

	for (const file of files) {
		const isBeingRemoved = removedFiles.some(
			(removeFile) => removeFile.name === file.originalFileName
		);

		if (isBeingRemoved) {
			if (baseLocation) {
				const removePromise = removeDocument(baseLocation, file.id)
					.then()
					.catch((error) => {
						logger.error(error);
						remainingFiles.push({ ...file, failedToRemove: true });
					});
				removePromises.push(removePromise);
			}
		} else {
			remainingFiles.push(file);
		}
	}

	// allow this to throw
	await Promise.all(removePromises);

	return remainingFiles;
};

/**
 * Removes files from the array and optionally blob storage
 * @param {Array.<{ storageId: string, originalFileName: string, id: string }>} files - all of the current files
 * @param {Array.<{ name: string }>} removedFiles - the files selected to be removed,
 * @param {string} referenceId
 * @param {string} baseLocation - if set this will attempt to remove the file id from blob storage in the location baseLocation/file.id
 * @param {(referenceId: string, documentId: string) => Promise<unknown>} deleteDocumentUploadFunction - function that deletes the document in the SQL db
 *
 * @returns {Promise.<Array<{storageId: string, originalFileName: string}>>} the remaining files after removal, if a file failed to be removed a property is added {failedToRemove: true}
 */
const removeFilesV2 = async (
	files,
	removedFiles,
	referenceId,
	baseLocation,
	deleteDocumentUploadFunction
) => {
	/** @type {{storageId: string, originalFileName: string}[]} */
	const failedRemovals = [];
	const promises = removedFiles.map(
		({ name: removedFileName }) =>
			new Promise((resolve, reject) => {
				const fileDetails = files.find((file) => removedFileName === file.originalFileName);
				if (!fileDetails) return reject('Removed file not found in uploaded files');
				const { storageId, id, originalFileName } = fileDetails;
				removeDocument(baseLocation, storageId)
					.then(
						() => deleteDocumentUploadFunction(referenceId, id),
						(error) => {
							failedRemovals.push({ storageId, originalFileName });
							reject(error);
						}
					)
					.then(resolve, (error) => {
						failedRemovals.push({ storageId, originalFileName });
						reject(error);
					});
			})
	);

	await Promise.allSettled(promises);

	return failedRemovals;
};

/**
 * @param {unknown} object
 * @returns {object is { uploadedFiles: import('src/dynamic-forms/dynamic-components/multi-file-upload/question').UploadedFiles }} // this'll become an FO only type
 */
const isObjectWithUploadedFiles = (object) => {
	// todo check keys
	return !!object && Object.hasOwn(object, 'uploadedFiles');
};

/**
 * @param {string} referenceId
 * @returns {string}
 */
function sanitiseReferenceId(referenceId) {
	return referenceId.replaceAll('/', '_');
}

/**
 * @param {JourneyResponse} journeyResponse
 * @returns {string}
 */
function generateDocumentSubmissionId(journeyResponse) {
	return `${journeyResponse.journeyId}:${encodeURIComponent(
		sanitiseReferenceId(journeyResponse.referenceId)
	)}`;
}

module.exports = {
	getValidFiles,
	removeFiles,
	removeFilesV2,
	isObjectWithUploadedFiles,
	generateDocumentSubmissionId
};
