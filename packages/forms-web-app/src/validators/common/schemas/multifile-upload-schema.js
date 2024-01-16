const config = require('../../../config');
const validateFileSize = require('../../custom/file-size');
const ClamAVClient = require('@pins/common/src/client/clamav-rest-client');

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
					throw new Error(`${name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`);
				}

				// must validate file size *before* ClamAV check as otherwise axios will throw request body size error
				// check file size
				validateFileSize(size, config.fileUpload.pins.uploadApplicationMaxFileSize, name);

				// check file for Virus
				const clamAVClient = new ClamAVClient(config.fileUpload.clamAVHost);
				await clamAVClient.scan(value, name, config.fileUpload.pins.uploadApplicationMaxFileSize);

				return true;
			}
		}
	}
});

module.exports = schema;
