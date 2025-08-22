const validateFileSize = require('../file-size');

/**
 *	Schema validation in express validator makes use of wild card patterns to select fields for validation.
 *	In this case passing in a wild card path effectively enforces the validation chain to evaluate on all fields that match
 *	that parameter.
 * 	@param {Object} params - The path that the files are located on, on the request body.
 * 	@param {string} params.path - The path that the files are located on, on the request body.
 * 	@param {Array<string>} params.allowedFileTypes - An array of allowed file mime types
 * 	@param {number} params.maxUploadSize - The max size allowed for file uploads in bytes
 * 	@param {function} params.getClamAVClient - a function that returns a ClamAV client instance
 */
const schema = ({ path, allowedFileTypes, maxUploadSize, getClamAVClient }) => ({
	[path]: {
		custom: {
			options: async (value) => {
				const { name, mimetype, size } = value;
				// check file extension type
				if (!allowedFileTypes.includes(mimetype)) {
					throw new Error(`${name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`);
				}

				// check file size
				validateFileSize(size, maxUploadSize, name);

				// check file for Virus
				// todo: is it safe to remove this and scan in blob storage instead
				const clamAVClient = getClamAVClient();
				await clamAVClient.scan(value, name);

				return true;
			}
		}
	}
});

module.exports = schema;
