const BaseValidator = require('./base-validator.js');
const { checkSchema } = require('express-validator');
const requiredFileUploadSchema = require('./schemas/required-file-upload-schema.js');

/**
 * @typedef {import('../question.js')} Question
 */

/**
 * enforces that at least one file is present for a question, whether it is being/already uploaded
 * @class
 */
class RequiredFileUploadValidator extends BaseValidator {
	/**
	 * creates an instance of a RequiredFileUploadValidator
	 * @param {string} [errorMessage] - custom error message to show on validation failure
	 */
	constructor(errorMessage) {
		super();

		if (errorMessage) {
			this.errorMessage = errorMessage;
		} else {
			this.errorMessage = 'You must add your documents';
		}
	}

	/**
	 * validates against path based on questionObj's fieldname
	 * @param {Question} questionObj
	 */
	validate(questionObj, journeyResponse) {
		const path = questionObj.fieldName;
		return checkSchema(requiredFileUploadSchema(path, journeyResponse, this.errorMessage))[0];
	}
}

module.exports = RequiredFileUploadValidator;
