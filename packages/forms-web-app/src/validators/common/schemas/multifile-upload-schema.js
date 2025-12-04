const config = require('../../../config');
const validateFileSize = require('../../custom/file-size');
const getClamAVClient = require('#lib/clam-av-client-get');

/**
 *	Schema validation in express validator makes use of wild card patterns to select fields for validation.
 *	In this case passing in a wild card path effectively enforces the validation chain to evaluate on all fields that match
 *	that parameter.
 * 	@param {string} path - The path that the files are located on, on the request body.
 */
const schema = (path) => ({
	[path]: {
		custom: {
			options: async (value) => {
				const { name, mimetype, size } = value;
				// check file extension type
				if (!Object.values(config.fileUpload.pins.allowedFileTypes).includes(mimetype)) {
					throw new Error(`${name} must be a DOC, DOCX, PDF, TIF, JPG, PNG, XLS or XLSX`);
				}

				// check file size
				validateFileSize(size, config.fileUpload.pins.maxFileUploadSize, name);

				// check file for Virus
				const clamAVClient = getClamAVClient();
				await clamAVClient.scan(value, name);

				return true;
			}
		}
	}
});

module.exports = schema;
