const { removeDocument } = require('../lib/documents-api-wrapper');
const logger = require('./logger');

const getValidFiles = (errors, files) => {
	// This function is called after the req has passed through validation middleware.
	// There can be valid and invalid files in a multi-file upload, and the valid files need
	// uploading, whilst the invalid ones do not. We will determine the valid files from the
	// validation `errors` object. During testing it was found `md5` is sometimes not unique(!)
	// though `tempFilePath` does appear to always be unique due to its use of timestamps.

	const erroredFilesByTempFilePath = Object.values(errors).reduce((acc, error) => {
		if (!error.value || !error.value.tempFilePath) {
			return acc;
		}
		return [...acc, error.value.tempFilePath];
	}, []);
	return files.filter((file) => erroredFilesByTempFilePath.includes(file.tempFilePath) === false);
};

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

module.exports = {
	getValidFiles,
	removeFiles
};
