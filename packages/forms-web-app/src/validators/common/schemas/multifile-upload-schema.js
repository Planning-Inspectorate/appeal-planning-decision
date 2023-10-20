const validAV = require('@planning-inspectorate/pins-clamav-rest-client');
const config = require('../../../config');
const validateFileSize = require('../../custom/file-size');

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
				const { mimetype, size } = value;
				// check file extension type
				if (!Object.values(config.fileUpload.pins.allowedFileTypes).includes(mimetype)) {
					throw new Error('The selected file must be a DOC, DOCX, PDF, TIF, JPG or PNG');
				}

				// must validate file size *before* ClamAV check as otherwise axios will throw request body size error
				// check file size
				validateFileSize(size, config.fileUpload.pins.uploadApplicationMaxFileSize);

				// check file for Virus
				await validAV(value, 'The selected file');

				return true;
			}
		}
	}
});

module.exports = schema;
