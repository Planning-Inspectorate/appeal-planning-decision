const validateFileSize = require('../file-size');

/**
 *	Schema validation in express validator makes use of wild card patterns to select fields for validation.
 *	In this case passing in a wild card path effectively enforces the validation chain to evaluate on all fields that match
 *	that parameter.
 * 	@param {Object} params - The path that the files are located on, on the request body.
 * 	@param {string} params.path - The path that the files are located on, on the request body.
 * 	@param {Array<string>} params.allowedFileTypes - An array of allowed file mime types
 * 	@param {number} params.maxUploadSize - The max size allowed for file uploads in bytes
 */
const schema = ({ path, allowedFileTypes, maxUploadSize }) => ({
	[path]: {
		custom: {
			options: async (value) => {
				const { name, mimetype, size } = value;
				// check file extension type
				if (!allowedFileTypes.includes(mimetype)) {
					throw new Error(`${name} must be a DOC, DOCX, PDF, TIF, JPG, PNG or XLSX`);
				}

				// check file size
				validateFileSize(size, maxUploadSize, name);

				// NOTE - validator no longer runs clamAV check for Virus

				return true;
			}
		}
	}
});

module.exports = schema;
