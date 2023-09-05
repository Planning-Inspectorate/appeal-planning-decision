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

const removeFiles = (files, removedFiles) => {
	for (const removedFile of removedFiles) {
		files = files.filter((file) => file.originalFileName !== removedFile.name);
	}
	return files;
};

module.exports = {
	getValidFiles,
	removeFiles
};
