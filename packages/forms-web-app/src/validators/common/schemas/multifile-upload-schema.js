const validAV = require('@planning-inspectorate/pins-clamav-rest-client');
const { validMimeType, validateMimeBinaryType } = require('pins-mime-validation');
const config = require('../../../config');
const validateFileSize = require('../../custom/file-size');

const {
	MIME_TYPE_DOC,
	MIME_BINARY_TYPE_DOC,
	MIME_TYPE_DOCX,
	MIME_TYPE_PDF,
	MIME_TYPE_JPEG,
	MIME_TYPE_TIF,
	MIME_TYPE_PNG
} = require('../../../lib/mime-types');

const schema = (path) => ({
	[path]: {
		custom: {
			options: async (value) => {
				const { name, mimetype, size } = value;

				// check file extension type
				validMimeType(
					mimetype,
					[
						MIME_TYPE_DOC,
						MIME_TYPE_DOCX,
						MIME_TYPE_PDF,
						MIME_TYPE_JPEG,
						MIME_TYPE_TIF,
						MIME_TYPE_PNG
					],
					`${name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`
				);

				// check binary mime type of file
				await validateMimeBinaryType(
					value,
					[
						MIME_BINARY_TYPE_DOC,
						MIME_TYPE_DOCX,
						MIME_TYPE_PDF,
						MIME_TYPE_TIF,
						MIME_TYPE_JPEG,
						MIME_TYPE_PNG
					],
					`${name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`
				);

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
