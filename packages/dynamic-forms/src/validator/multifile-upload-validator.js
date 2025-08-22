const BaseValidator = require('./base-validator.js');

const multifileUploadSchema = require('./schemas/multifile-upload-schema.js');
const { checkSchema } = require('express-validator');

/**
 * @typedef {import('../question.js')} Question
 */

/**
 * enforces that files being uploaded are valid
 * @class
 */
class MultifileUploadValidator extends BaseValidator {
	/**
	 * creates an instance of a MultifileUploadValidator
	 * @param {Object} params - custom error message to show on validation failure
	 * @param {string} [params.errorMessage] - custom error message to show on validation failure
	 * @param {Array<string>} params.allowedFileTypes - An array of allowed file mime types
	 * @param {number} params.maxUploadSize - The max size allowed for file uploads in bytes
	 * @param {function} params.getClamAVClient - a function that returns a ClamAV client instance
	 */
	constructor({ allowedFileTypes, maxUploadSize, getClamAVClient, errorMessage = undefined }) {
		super();

		// standard generic error messages for multifile upload are currently
		// hardcoded into the multifileUploadSchema but this field
		// is included here in case it is required later
		if (errorMessage) {
			this.errorMessage = errorMessage;
		}

		this.allowedFileTypes = allowedFileTypes;
		this.maxUploadSize = maxUploadSize;
		this.getClamAVClient = getClamAVClient;
	}

	/**
	 * validates response body files on path based on questionObj's fieldname
	 * @param {Question} questionObj
	 */
	validate(questionObj) {
		const path = `files.${questionObj.fieldName}.*`;
		return checkSchema(
			multifileUploadSchema({
				path,
				allowedFileTypes: this.allowedFileTypes,
				maxUploadSize: this.maxUploadSize,
				getClamAVClient: this.getClamAVClient
			})
		)[0];
	}
}

module.exports = MultifileUploadValidator;
