const validAV = require('@planning-inspectorate/pins-clamav-rest-client');
const config = require('../../../config');
const validateFileSize = require('../../custom/file-size');

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
				await validAV(value, name);

				return true;
			}
		}
	}
});

module.exports = schema;
